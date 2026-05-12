<?php
namespace App\Http\Controllers\backend\V1\Post;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\Post\PostCatalogue\StoreRequest;
use App\Http\Requests\Post\PostCatalogue\UpdateRequest;
use App\Service\Interfaces\Post\PostCatalogueServiceInterface as PostCatalogueService;
use Illuminate\Http\Request;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\Post\PostCatalogue\BulkDestroyRequest;
use App\Http\Requests\Post\PostCatalogue\BulkUpdateRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostCatalogueController extends BaseController
{
    use AuthorizesRequests;

    protected $userCatalogueService;
    protected $userService;

    public function __construct(
        PostCatalogueService $service,
        UserService $userService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->authorize('module', 'post_catalogue:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->setWith([])->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/post/post_catalogue/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        $this->authorize('module', 'post_catalogue:store');
        return Inertia::render('backend/post/post_catalogue/save');
    }

    public function edit($id){
        $this->authorize('module', 'post_catalogue:update');
        $record = $this->service->show($id);
        return Inertia::render('backend/post/post_catalogue/save',[
            'record' => $record
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        dd($request->all());
        $this->authorize('module', 'post_catalogue:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'post_catalogue.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        $this->authorize('module', 'post_catalogue:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'post_catalogue.index', editRoute: 'post_catalogue.edit');
    }

    public function destroy($id){
        $this->authorize('module', 'post_catalogue:delete');
        $response = $this->service->destroy($id);
        return to_route('post_catalogue.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->authorize('module', 'post_catalogue:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->authorize('module', 'post_catalogue:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}