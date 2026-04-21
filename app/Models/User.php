<?php
namespace App\Models;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Hasquery;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
class User extends Authenticatable {

   use SoftDeletes, HasFactory, Notifiable, TwoFactorAuthenticatable, Hasquery;

    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'remember_token',
        'deleted_at',
        'publish',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
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
        return $this->belongsToMany(UserCatalogue::class, 'user_catalogue_user');
    }

    public $casts = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
    ];
}   

