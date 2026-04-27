<?php
namespace App\Service\Impl\V1\Setting;
use App\Service\Impl\BaseService;
use App\Service\Interfaces\Setting\LanguageServiceInterface;
use App\Repositories\Setting\LanguageRepo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
class LanguageService extends BaseService implements LanguageServiceInterface{

    protected $repository;
    protected $with = ['creators'];

    // protected $perpage = '';
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name', 'canonical'];
    protected $isMultipleLanguage = true;
    protected $complexFilter = ['id'];


    public function __construct(LanguageRepo $repository) {
        $this->repository = $repository;
        parent::__construct($repository);
    }

    protected function prepareModelData() : static{
        $fillable = $this->repository->getFillable();
        $this->modelData = $this->request->only($fillable);
        if ($this->request->hasFile('image')) {
            $path = $this->request->file('image')->store('languages', 'public');
            $this->modelData['image'] = $path;
        }
        $this->modelData['user_id'] = Auth::user()->id;
        return $this;
    }
}