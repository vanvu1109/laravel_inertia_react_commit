<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Hasquery;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
class User extends Authenticatable
{
    use SoftDeletes, Hasquery;

    protected $fillable = [
        'name',
        'email',
        'password',        
        'birthday',
        'address',
        'deleted_at',
        'publish',
        'user_id'
    ];

    protected $relationable = [
        'user_catalogues',
    ];


    public function getRelationable()
    {
        return $this->relationable;
    }

    public function creators(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function user_catalogues(): BelongsToMany
    {
        return $this->belongsToMany(UserCatalogue::class, 'user_catalogue_user');
    }



     protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'created_at' => 'datetime:d-m-Y H:i:s',
            'updated_at' => 'datetime:d-m-Y H:i:s',
        ];
    }

    protected function birthday():Attribute{
        return Attribute::make(
            get: fn($value) => $value ? date('d-m-Y', strtotime($value)) : null,
            set: fn($value) => $value ? Carbon::parse($value)->format('Y-m-d') : null
        );
    }
}