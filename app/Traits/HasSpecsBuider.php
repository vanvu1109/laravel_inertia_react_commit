<?php

namespace App\Traits;

trait HasSpecsBuider
{

    protected function build(array $filter = []){
        $conditions = [];
        if(is_array($filter) && count($filter)){
            foreach($filter as $key => $value){
                if($this->request->has($value)){
                    $conditions[$value] = $this->request->input($value);
                }
            }
        }
        return $conditions;
    }

    public function specifications(): array {
      return [
        'all' =>  $this->request->input('type') === 'all',
        'perpage' => $this->request->input('perpage') ?? $this->perpage,
        'sort' => $this->request->input('sort') ? explode(',', $this->request->input('sort')) : $this->sort,
        'filter' => [
            'simple' => $this->build($this->simpleFilter),
            'keyword' =>[
                'q' => $this->request->input('keyword'),
                'fields' => $this->searchField,
                'isMultipleLanguage' => $this->isMultipleLanguage ?? false,
            ],
            'complex' => $this->build($this->complexFilter),
            'date' => $this->build($this->dateFilter),
            'with' => $this->build($this->withFilter)
            ],
        'with' => $this->with,
      ];
    }

}