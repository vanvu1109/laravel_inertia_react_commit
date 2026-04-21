<?php
namespace App\Http\Controllers\backend\V1\Permission;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\Permission\Permission\StoreRequest;
use App\Http\Requests\Permission\Permission\UpdateRequest;
use App\Service\Interfaces\Permission\PermissionServiceInterface as PermissionService;
use Illuminate\Http\Request;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\Permission\Permission\BulkDestroyRequest;
use App\Http\Requests\Permission\Permission\BulkUpdateRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class PermissionController extends BaseController
{
    use AuthorizesRequests;
    protected $userCatalogueService;
    protected $userService;

    public function __construct(
        PermissionService $service,
        UserService $userService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->Authorize('module', 'permission:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/permission/permission/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        $this->Authorize('module', 'permission:store');
        return Inertia::render('backend/permission/permission/save');
    }

    public function edit($id){
        $this->Authorize('module', 'permission:update');
        $record = $this->service->show($id);
        return Inertia::render('backend/permission/permission/save',[
            'record' => $record
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $this->Authorize('module', 'permission:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'permission.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        $this->Authorize('module', 'permission:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'permission.index', editRoute: 'permission.edit');
    }

    public function destroy($id){
        $this->Authorize('module', 'permission:delete');
        $response = $this->service->destroy($id);
        return to_route('permission.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->Authorize('module', 'permission:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->Authorize('module', 'permission:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}