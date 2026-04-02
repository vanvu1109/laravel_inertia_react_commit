<?php
namespace App\Service\Impl\V1\User;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\User\UserCatalogueServiceInterface;
use App\Repositories\User\UserCatalogueRepo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class UserCatalogueService extends BaseService implements UserCatalogueServiceInterface{

    protected $repository;
    protected $with = ['creators', 'users'];

    // protected $perpage = '';
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(UserCatalogueRepo $repository) {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData() : static{
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        if(isset($this->modelData['canonical'])){
            $this->modelData['canonical'] = Str::slug($this->modelData['canonical']);
        }
        $this->modelData['user_id'] = Auth::user()->id;
        return $this;
    }
}