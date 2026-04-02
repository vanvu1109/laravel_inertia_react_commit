<?php
namespace App\Service\Impl\V1\User;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\User\UserServiceInterface;
use App\Repositories\User\UserRepo;
use Illuminate\Support\Facades\Auth;
class UserService extends BaseService implements UserServiceInterface {

    protected $repository;
    protected $with = [];

    protected $perpage = 10;
    // protected $simpleFilter = ['name'];
    protected $searchField = ['name', 'phone', 'email', 'address', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(UserRepo $repository) {
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