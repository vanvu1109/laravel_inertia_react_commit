<?php
namespace App\Service\Impl\V1\Post;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\Post\PostCatalogueServiceInterface;
use App\Repositories\Post\PostCatalogueRepo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class PostCatalogueService extends BaseService implements PostCatalogueServiceInterface{

    protected $repository;
    protected $with = [];

    // protected $perpage = '';
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(PostCatalogueRepo $repository) {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData() : static{
        dd($this->request->all());
        // dd($this->request->file('images'));
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        if ($this->request->hasFile('images')) {
            $paths = [];
            foreach ($this->request->file('images') as $file) {
                $paths[] = $file->store('post_catalogues', 'public');
            }

            $this->modelData['album'] = json_encode($paths);
        }
        
        $this->modelData['user_id'] = Auth::user()->id;
        return $this;
    }
}