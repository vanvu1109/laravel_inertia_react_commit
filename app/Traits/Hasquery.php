<?php
namespace App\Traits;
use Illuminate\Support\Carbon;

trait Hasquery {

    public function scopeSimpleFilter($query, array $filters = []){
        if(is_array($filters) && count($filters)){
            foreach($filters as $field => $value) {
                if(!empty($value) && $value != 0 && !is_null($value)) {
                    $query->where($field, $value);
                }
            }
        }
        return $query;
    }

    public function scopeKeyword($query, $keyword = []) {
        if (isset($keyword['q']) && !empty($keyword['q'])) {
            $search = $keyword['q'];
            $fields = $keyword['fields'] ?? [];

            if (!empty($fields)) {
                $query->where(function ($q) use ($fields, $search) {
                    foreach ($fields as $field) {
                        $q->orWhere($field, 'LIKE', '%' . $search . '%');
                    }
                });
            }
        }
        return $query;
    }

    public function scopeComplexFilter($query, array $filters = [], string $relationName=''){
        if(count($filters)){
            $table = $this->getTable();
            foreach($filters as $field => $condition) {
                if(count($condition)) {
                    $qualifield = !empty($relationName) ? "{$relationName}.{$field}" : $field;
                    foreach($condition as $operator => $value) {
                        switch($operator) {
                            case 'gt':
                                $query->where($qualifield, '>', $value);
                            break;
                            case 'gte':
                                $query->where($qualifield, '>=', $value);
                            break;
                            case 'lt':
                                $query->where($qualifield, '<', $value);
                            break;
                            case 'lte':
                                $query->where($qualifield, '<=', $value);
                            break;
                            case 'eq':
                                $query->where($qualifield, '=', $value);
                            break;
                            case 'between':
                                $parts = explode(',', $value);
                                if(count($parts) == 2) {
                                    [$min, $max] = $parts;
                                    $query->whereBetween($qualifield,[$min, $max]);
                                }
                            break;
                            case 'in':
                                $in = explode(',', $value);
                                if(isset($in) && count($in)) {
                                    $query->whereIn($qualifield, $in);
                                }
                            break;
                        }
                        }
                }
            }
        }   
        return $query;
    }

    public function scopeDateFilter($query, array $filters = []){
            if(count($filters)){
                foreach($filters as $field => $condition) {
                    if(count($condition)) {
                    foreach($condition as $operator => $value) {
                        switch($operator) {
                            case 'gt':
                                $query->where($field, '>', Carbon::parse($value)->startOfDay());
                            break;
                            case 'gte':
                                $query->where($field, '>=', Carbon::parse($value)->startOfDay()); ;
                            break;
                            case 'lt':
                                $query->where($field, '<', Carbon::parse($value)->endOfDay());;
                            break;
                            case 'lte':
                                $query->where($field, '<=', Carbon::parse($value)->endOfDay());;
                            break;
                            case 'eq':
                                $query->where($field, '=', Carbon::parse($value)->startOfDay());;
                            break;
                            case 'between':
                                [$startDate, $endDate] = explode(',', $value);
                                $startDate = Carbon::parse($startDate)->startOfDay();
                                $endDate = Carbon::parse($endDate)->endOfDay();
                                if(isset($startDate) && isset($endDate)) {
                                    $query->whereBetween($field,[$startDate, $endDate]);
                                }
                            break;
                        }
                    }
                }
            }
        }   
        return $query;
    }
                                
    protected function scopeWithFilter($query, array $filters = []){
        if(count($filters)){
            foreach($filters as $model => $condition) {
                $query->whereHas($model, function($subquery) use ($condition, $model) {
                    $this->applyRelationRecursive($subquery, $condition, $model);
                });
            }
        }
    }

    protected function applyRelationRecursive($query, array $condition = [], $model){
        $filedCondition = [];
        $relataionConditon = [];
        $operatorArray = array_flip(['gt', 'gte', 'eq', 'in','between', 'lt', 'lte']);
        foreach($condition as $key => $value){
            if(isset($value) && is_array($value) && array_intersect_key($value, $operatorArray)){
                $filedCondition[$key] = $value; 
            }else{
                $relataionConditon[$key] = $value;
            }
        }
        // dd($condition);
        $this->scopeComplexFilter($query,$filedCondition,$model);
        if(count($relataionConditon) && is_array($relataionConditon)){
            foreach($relataionConditon as $key => $value){
                $query->whereHas($key, function($recursiveQuery) use ($value, $key){
                    $this->applyRelationRecursive($recursiveQuery,$value,$key);      
                });
            }
        }
    }
}
