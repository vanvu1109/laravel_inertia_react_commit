<?php
namespace App\Service\Impl\V1\post;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\post\PostServiceInterface;
use App\Repositories\post\PostRepo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class PostService extends BaseService implements PostServiceInterface{

    protected $repository;
    protected $with = [];

    // protected $perpage = '';
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(PostRepo $repository) {
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