<?php
namespace App\Service\Impl\V1\Permission;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\Permission\PermissionServiceInterface;
use App\Repositories\Permission\PermissionRepo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class PermissionService extends BaseService implements PermissionServiceInterface{

    protected $repository;
    protected $with = ['user_catalogues', 'creators'];

    // protected $perpage = '';
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(PermissionRepo $repository) {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData() : static{
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        $this->modelData['user_id'] = Auth::user()->id;
        return $this;
    }
}