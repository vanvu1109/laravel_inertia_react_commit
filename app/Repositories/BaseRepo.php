<?php
namespace App\Repositories;
use Illuminate\Database\Eloquent\Model;
class BaseRepo {

    protected $model;
    public function __construct($model) {
        $this->model = $model;
    }

    public function getFillable() {
        return $this->model->getFillable();
    }

    public function getRelationable() {
        return $this->model->getRelationable();
    }

    public function create(array $payload=[]): Model {
        return $this->model->create($payload)->fresh();
    }

    public function update(int $id, array $payload = []): Model{
        $model = $this->findById($id);
        $model->fill($payload);
        $model->save();
        return $model;
    }


    public function findById(int $id, array $with = [], ?array $columns = ['*']): Model{
        return $this->model->select($columns)->with($with)->findOrFail($id);
    }

    public function pagination(array $specs= []){
        return $this->model
            ->simpleFilter($specs['filter']['simple'] ?? [])
            ->keyword($specs['filter']['keyword'] ?? [])
            ->orderBy($specs['sort'][0], $specs['sort'][1])
            ->complexFilter($specs['filter']['complex'] ?? [])
            ->dateFilter($specs['filter']['date'] ?? [])
            ->with($specs['with'] ?? [])
            ->withFilter($specs['filter']['with'] ?? [])
            ->when(
            $specs['all'],
            fn($q)  => $q->get(),
            fn($q)  => $q->paginate($specs['perpage'])->withQueryString()
            // fn($q) => $q->toSql()
        );
    }

    public function bulkDestroy(array $ids = [], ?bool $forceDelete = false) {
        return $forceDelete ? $this->model->whereIn('id', $ids)->forceDelete() : $this->model->whereIn('id', $ids)->delete();
    }

    public function bulkUpdate(array $ids = [], array $payload = []) {
        return $this->model->whereIn('id', $ids)->update($payload);
    }


}