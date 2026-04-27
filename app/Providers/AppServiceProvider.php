<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use App\Service\Interfaces\User\UserCatalogueServiceInterface;
use App\Service\Impl\V1\User\UserCatalogueService;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Service\Impl\V1\User\UserService;
use App\Service\Interfaces\User\UserServiceInterface;
use App\Service\Interfaces\Permission\PermissionServiceInterface;
use App\Service\Impl\V1\Permission\PermissionService;
use App\Service\Interfaces\Setting\LanguageServiceInterface;
use App\Service\Impl\V1\Setting\LanguageService;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        JsonResource::withoutWrapping();

        $this->app->bind(UserCatalogueServiceInterface::class, UserCatalogueService::class);
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(PermissionServiceInterface::class, PermissionService::class);
        $this->app->bind(LanguageServiceInterface::class, LanguageService::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
