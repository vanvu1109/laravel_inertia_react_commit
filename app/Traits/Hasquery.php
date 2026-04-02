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

    public function scopeComplexFilter($query, array $filters = []){
        if(count($filters)){
            foreach($filters as $field => $condition) {
                if(count($condition)) {
                   foreach($condition as $operator => $value) {
                      switch($operator) {
                        case 'gt':
                            $query->where($field, '>', $value);
                        break;
                        case 'gte':
                            $query->where($field, '>=', $value);
                        break;
                        case 'lt':
                            $query->where($field, '<', $value);
                        break;
                        case 'lte':
                            $query->where($field, '<=', $value);
                        break;
                        case 'eq':
                            $query->where($field, '=', $value);
                        break;
                        case 'between':
                            $parts = explode(',', $value);
                            if(count($parts) == 2) {
                                [$min, $max] = $parts;
                                $query->whereBetween($field,[$min, $max]);
                            }
                        break;
                        case 'in':
                            $in = explode(',', $value);
                            if(isset($in) && count($in)) {
                                $query->whereIn($field, $in);
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
}
