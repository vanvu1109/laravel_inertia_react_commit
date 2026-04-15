<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hasquery;
class UserCatalogue extends Model {

    use SoftDeletes, Hasquery;

    protected $fillable = [
        'name',
        'canonical',
        'description',
        'user_id',
        'deleted_at',
        'publish',
    ];
    

    protected $relationable = [
        'users',
        'creators',
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

    public $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
    ];
    
}

