<?php
namespace App\Service\Impl;
use App\Service\Interfaces\BaseServiceInterface;
use Illuminate\Http\Request;
use App\Traits\HasTransaction;
use App\Traits\HasSpecsBuider;
abstract class BaseService implements BaseServiceInterface{
    
    use HasTransaction;
    use HasSpecsBuider;
    protected $repository;
    protected $request;
    protected $modelData;
    protected $model;
    protected $result;

    protected $with = [];

    protected $perpage = 20;
    protected $simpleFilter = ['publish'];
    protected $searchField = ['name'];
    protected $isMultipleLanguage = false;
    protected $complexFilter = ['id'];
    protected $dateFilter = ['created_at','updated_at'];
    protected $sort = ['id','desc'];
    protected $withFilter = [];
    
    public function __construct($repository){
        $this->repository = $repository;
    }      

    protected function setRequest(Request $request):static{
        $this->request = $request;
        return $this;
    }

    protected abstract function prepareModelData();

    public function save(Request $request, ?int $id = null){
        try{
            return 
                $this->beginTransaction()
                    ->setRequest($request)
                    ->prepareModelData()
                    ->beforeSave()
                    ->saveModel($id)
                    ->withRelation()
                    ->afterSave()
                    ->commit()
                    ->getResult();
        }catch(\Throwable $th){
            $this->rollback();
            return false;
        }
    }

    private function saveModel(?int $id = null){
        $this->model = (!$id)
            ? $this->repository->create($this->modelData)
            : $this->repository->update($id,$this->modelData);
        $this->result = $this->model;
        return $this;
    }


    private function getResult(){
        return $this->result;
    }

    public function show($id){
        $this->findById($id);
        $this->result = $this->model;
        return $this->getResult();
    }

    public function findById(int $id){
        $this->model = $this->repository->findById($id, $this->with);
    }
    
    public function paginate(Request $request){
        // dd($request->all());
        $this->setRequest($request);
        $specifications = $this->specifications();
        $this->result = $this->repository->pagination($specifications,$this->with);
        // dd($this->result);
        return $this->getResult();
    }

    public function destroy(int $id){
        try{ 
            return $this->beginTransaction()
            ->beforeDelete($id)
            ->deleteModel($id)
            ->afterDelete()
            ->commit()
            ->getResult();
       }catch(\Throwable $th){
            $this->rollback();
            return false;
       }
    }

    private function deleteModel():static{
        $this->result = $this->model->delete();
        return $this;
    }

    public function bulkDestroy(Request $request){
        try{
            return $this->beginTransaction()
            ->setRequest($request)
            ->beforeBulkDelete()
            ->deleteBulkModel()
            ->afterBulkDelete()
            ->commit()
            ->getResult();
        }catch(\Throwable $th){
            $this->rollback();
            return false;
        }
    }

    private function deleteBulkModel():static{
        $this->result = $this->repository->bulkDestroy($this->request->input('ids', []));
        return $this;
    }

    public function bulkUpdate(Request $request){
        try{
            return $this
            ->beginTransaction()
            ->setRequest($request)
            ->beforeBulkUpdate()
            ->bulkUpdateModel()
            ->afterBulkUpdate()
            ->commit()
            ->getResult();
        }catch(\Throwable $th){
            $this->rollback();
            return false;
        }
    }

    private function bulkUpdateModel():static{
        $fillable = $this->repository->getFillable();
        $payload = $this->request->only($fillable);
        $this->result = $this->repository->bulkUpdate($this->request->input('ids', []), $payload);
        return $this;
    }

}