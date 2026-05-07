<?php
namespace App\Repositories\post;
use App\Repositories\BaseRepo;
use App\Models\Post;
class PostRepo extends BaseRepo{
    protected $model;

    public function __construct(Post $model){
        $this->model = $model;
        parent::__construct($model);
    }
}
