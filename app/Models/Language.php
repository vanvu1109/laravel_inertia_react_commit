<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hasquery;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Language extends Model {
    
    use SoftDeletes, Hasquery;

    protected $fillable = [
        'name',
        'canonical',
        'description',
        'image',
        'user_id',
        'publish',
        'deleted_at',
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
    ];
}   

