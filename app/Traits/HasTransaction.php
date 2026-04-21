<?php
namespace App\Traits;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
trait HasTransaction
{
    public function beginTransaction(): static{
        DB::beginTransaction();
        return $this;
    }
    public function commit(): static{
        DB::commit();
        return $this;
    }
    public function rollback(): static{
        DB::rollBack();
        return $this;
    }

    public function beforeSave(): static{
        return $this;
    }

    public function afterSave(): static{
        return $this;
    }

    public function beforeDelete(int $id): static{
        $this->findById($id);
        return $this;
    }

    public function afterDelete(): static{
        return $this;
    }

    public function beforeBulkDelete(): static{
        return $this;
    }   

    public function afterBulkDelete(): static{
        return $this;
    }

    public function beforeBulkUpdate(): static{
        return $this;
    }   

    public function afterBulkUpdate(): static{
        return $this;
    }


    protected function withRelation():static{
        $relationable = $this->repository->getRelationable() ??  [];        
        foreach ($relationable as $relation) {
            if($relation === 'users'){
                $this->model->$relation()->sync([Auth::id()]);
            }

            if($this->request->has($relation)){
                $this->model->$relation()->sync($this->request->get($relation));
            }
        }
        return $this;
    }
}