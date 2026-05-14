<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hasquery;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostCatalogue extends Model {

    use SoftDeletes, Hasquery;

    protected $fillable = [
        'name', 
        'user_id',
        'parent_id',
        'lft',
        'rgt',
        'level',
        'order',
        'image',
        'album',
        'type',
        'sctipt',
        'deleted_at',
        'publish',
    ];
    

    protected $relationable = [
        
    ];

    public function getRelationable()
    {
        return $this->relationable;
    }

    public function creators(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
        'album' => 'array',
    ];
}   

