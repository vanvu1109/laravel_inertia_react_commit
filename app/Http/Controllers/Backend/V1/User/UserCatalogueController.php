<?php
namespace App\Http\Controllers\backend\V1\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\User\UserCatalogue\StoreRequest;
use App\Http\Requests\User\UserCatalogue\UpdateRequest;
use App\Service\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;
use Illuminate\Http\Request;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\User\UserCatalogue\BulkDestroyRequest;
use App\Http\Requests\User\UserCatalogue\BulkUpdateRequest;
use App\Service\Interfaces\Permission\PermissionServiceInterface as PermissionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class UserCatalogueController extends BaseController
{
    use AuthorizesRequests;
    protected $userCatalogueService;
    protected $userService;
    protected $permissionService;

    public function __construct(
        UserCatalogueService $service,
        UserService $userService,
        PermissionService $permissionService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        $this->permissionService = $permissionService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->authorize('module', 'user_catalogue:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->setWith([])->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/user/user_catalogue/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        $this->authorize('module','user_catalogue:store');
        $permissions = $this->permissionService->paginate(new Request()->merge(['type' => 'all', 'sort' => 'canonical,asc']));
        return Inertia::render('backend/user/user_catalogue/save', [
            'permissions' => $permissions
        ]);
    }

    public function edit($id){
        $this->authorize('module','user_catalogue:update');
        $permissions = $this->permissionService->paginate(new Request()->merge(['type' => 'all', 'sort' => 'canonical,asc']));
        $record = $this->service->show($id);
        return Inertia::render('backend/user/user_catalogue/save',[
            'record' => $record,
            'permissions' => $permissions
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $this->authorize('module','user_catalogue:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'user_catalogue.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        // dd($request->all());
        $this->authorize('module','user_catalogue:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'user_catalogue.index', editRoute: 'user_catalogue.edit');
    }

    public function destroy($id){
        $this->authorize('module','user_catalogue:delete');
        $response = $this->service->destroy($id);
        return to_route('user_catalogue.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->authorize('module','user_catalogue:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->authorize('module','user_catalogue:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}