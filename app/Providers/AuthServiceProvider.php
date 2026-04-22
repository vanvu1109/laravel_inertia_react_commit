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
    public function boot(): void{
        Gate::define('module', function ($user, $permission) {
            if ($permission === 'user:update') return true;
            if ($user->publish !== '2') return false;
            $user->loadMissing('user_catalogues.permissions');
            $permissions = $user->user_catalogues->flatMap(fn($uc) => $uc->permissions)->pluck('canonical')->unique();
            return $permissions->contains($permission);
        });
    }
}
