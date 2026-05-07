<?php
namespace App\Http\Controllers\backend\V1\post;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\post\Post\StoreRequest;
use App\Http\Requests\post\Post\UpdateRequest;
use App\Service\Interfaces\post\PostServiceInterface as PostService;
use Illuminate\Http\Request;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\post\Post\BulkDestroyRequest;
use App\Http\Requests\post\Post\BulkUpdateRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends BaseController
{
    use AuthorizesRequests;

    protected $userCatalogueService;
    protected $userService;

    public function __construct(
        PostService $service,
        UserService $userService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->authorize('module', 'post:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->setWith([])->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/post/post/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        $this->authorize('module', 'post:store');
        return Inertia::render('backend/post/post/save');
    }

    public function edit($id){
        $this->authorize('module', 'post:update');
        $record = $this->service->show($id);
        return Inertia::render('backend/post/post/save',[
            'record' => $record
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $this->authorize('module', 'post:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'post.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        $this->authorize('module', 'post:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'post.index', editRoute: 'post.edit');
    }

    public function destroy($id){
        $this->authorize('module', 'post:delete');
        $response = $this->service->destroy($id);
        return to_route('post.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->authorize('module', 'post:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->authorize('module', 'post:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}