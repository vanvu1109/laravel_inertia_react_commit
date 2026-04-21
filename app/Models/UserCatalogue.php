<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hasquery;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UserCatalogue extends Model {

    use SoftDeletes, Hasquery;

    protected $fillable = [
        'name',
        'deleted_at',
        'description',
        'canonical',
        'user_id',
        'publish',
    ];
    

    protected $relationable = [
        'permissions',
        'users',
    ];

    public function getRelationable()
    {
        return $this->relationable;
    }

    public function creators(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'user_catalogue_user');
    }

    public function permissions(): BelongsToMany {
        return $this->belongsToMany(Permission::class, 'user_catalogue_permission');
    }
    public $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
    ];
}   

