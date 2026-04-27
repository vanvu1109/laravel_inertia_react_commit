<?php
namespace App\Http\Controllers\backend\V1\Setting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Http\Controllers\backend\BaseController;
use App\Http\Requests\Setting\Language\StoreRequest;
use App\Http\Requests\Setting\Language\UpdateRequest;
use App\Service\Interfaces\Setting\LanguageServiceInterface as LanguageService;
use Illuminate\Http\Request;
use App\Service\Interfaces\User\UserServiceInterface as UserService;
use Illuminate\Support\Facades\Lang;
use App\Http\Requests\Setting\Language\BulkDestroyRequest;
use App\Http\Requests\Setting\Language\BulkUpdateRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class LanguageController extends BaseController
{
    use AuthorizesRequests;

    protected $userCatalogueService;
    protected $userService;

    public function __construct(
        LanguageService $service,
        UserService $userService
    )
    {
        $this->service = $service;
        $this->userService = $userService;
        parent::__construct($service);
    }
    
    public function index(Request $request){
        $this->authorize('module', 'language:index');
        $records = $this->service->paginate($request);
        $users = $this->userService->paginate(new Request()->merge(['type' => 'all', 'sort' => 'name,asc']));
        return Inertia::render('backend/setting/language/index',[
            'records' => $records,
            'users' => $users,
            'request' => $request->all()
        ]);
    }

    public function create(){
        $this->authorize('module', 'language:store');
        return Inertia::render('backend/setting/language/save');
    }

    public function edit($id){
        $this->authorize('module', 'language:update');
        $record = $this->service->show($id);
        return Inertia::render('backend/setting/language/save',[
            'record' => $record
        ]);
    }


    public function store(StoreRequest $request):RedirectResponse{
        $this->authorize('module', 'language:store');
        $response = $this->service->save($request);
        return $this->handleAction($response, $request, redirectRoute: 'language.index');
    }

    public function update(UpdateRequest $request, $id):RedirectResponse{
        dd($request->all());
        $this->authorize('module', 'language:update');
        $response = $this->service->save($request, $id);
        return $this->handleAction($response, $request, redirectRoute: 'language.index', editRoute: 'language.edit');
    }

    public function destroy($id){
        $this->authorize('module', 'language:delete');
        $response = $this->service->destroy($id);
        return to_route('language.index')->with('success', Lang::get('message.delete_success'));
    }

    public function bulkDestroy(BulkDestroyRequest $request){
        $this->authorize('module', 'language:bulkDestroy');
        $response = $this->service->bulkDestroy($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.delete_success')) 
            : redirect()->back()->with('error', Lang::get('message.delete_error'));
    }

    public function bulkUpdate(BulkUpdateRequest $request){
        $this->authorize('module', 'language:bulkUpdate');
        $response = $this->service->bulkUpdate($request);
        return $response 
            ? redirect()->back()->with('success', Lang::get('message.save_success')) 
            : redirect()->back()->with('error', Lang::get('message.save_failed'));
    }
}