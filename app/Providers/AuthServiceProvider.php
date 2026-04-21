<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::define('module', function ($user, $permission) {
            if($user->publish == 1) return false;
            $user->loadMissing('user_catalogues.permissions');
            $permissions = $user->user_catalogues->flatMap(fn($user_catalogue) => 
                $user_catalogue->permissions)->pluck('canonical')->unique()->values();
            return $permissions->contains($permission);
            ;
        });  
    }
}
