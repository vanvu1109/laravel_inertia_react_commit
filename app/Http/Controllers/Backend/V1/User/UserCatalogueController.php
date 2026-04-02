<?php
namespace App\Http\Controllers\backend\v1\User;
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
class UserCatalogueController extends BaseController
{
    protected $userCatalogueService;
    protected $userService;

    public function __construct(
        UserCatalogueService $service,
        UserService $userService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        parent::__construct($service);
    }
    public function index(Request $request){
        $records = $this->service->paginate($request);
        $users = $this->userService->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/user/user_catalogue/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        return Inertia::render('backend/user/user_catalogue/save');
    }

    public function edit($id){
        $record = $this->service->show($id);
        return Inertia::render('backend/user/user_catalogue/save',[
            'record' => $record
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'user_catalogue.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'user_catalogue.index', editRoute: 'user_catalogue.edit');
    }

    public function destroy($id){
        $response = $this->service->destroy($id);
        return to_route('user_catalogue.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}