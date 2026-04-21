<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hasquery;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model {

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
        'user_catalogues',
    ];

    public function getRelationable()
    {
        return $this->relationable;
    }

    public function creators(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function user_catalogues(): BelongsToMany {
        return $this->belongsToMany(UserCatalogue::class, 'user_catalogue_permission');
    }

    public $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
    ];

}

