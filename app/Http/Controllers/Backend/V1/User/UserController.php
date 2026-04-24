<?php
namespace App\Http\Controllers\backend\V1\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\User\User\StoreRequest;
use App\Http\Requests\User\User\UpdateRequest;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\User\User\BulkDestroyRequest;
use App\Http\Requests\User\User\BulkUpdateRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Service\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;
class UserController extends BaseController
{
    use AuthorizesRequests;

    protected $userService;
    protected $userCatalogueService;
    public function __construct(
        UserService $service,
        UserCatalogueService $userCatalogueService
    )
    {
        $this->userService = $service;
        $this->userCatalogueService = $userCatalogueService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->authorize('module', 'user:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->paginate(new Request(['type' => 'all', 'sort' => 'name,asc']));
        $userCatalogues = $this->getUserCatalogues();
        return Inertia::render('backend/user/user/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all(),
            'userCatalogues' => $userCatalogues
        ]);
    }

    public function create(){
        $this->authorize('module', 'user:store');
        $userCatalogues = $this->getUserCatalogues();
        return Inertia::render('backend/user/user/save',[
            'userCatalogues' => $userCatalogues
        ]);
    }

    public function edit($id){
        $this->authorize('module', 'user:update');
        $userCatalogues = $this->userCatalogueService->paginate(new Request(['type' => 'all', 'sort' => 'name,asc']));
        $record = $this->service->show($id);
        return Inertia::render('backend/user/user/save',[
            'record' => $record,
            'userCatalogues' => $userCatalogues
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $this->authorize('module', 'user:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'user.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        $this->authorize('module', 'user:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'user.index', editRoute: 'user.edit');
    }

    public function destroy($id){
        $this->authorize('module', 'user:delete');
        $response = $this->service->destroy($id);
        return to_route('user.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->authorize('module', 'user:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->authorize('module', 'user:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }

    private function getUserCatalogues(){
        return $this->userCatalogueService->paginate(new Request(['type' => 'all', 'sort' => 'name,asc']));
    }
}