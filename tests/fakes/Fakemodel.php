<?php

namespace Tests\Fakes;
use Illuminate\Database\Eloquent\Model;

class Fakemodel extends Model
{
    protected $guarded = [];
    public $timestamps = false; 

    public function getRelationable(){
        return [];
    }
}