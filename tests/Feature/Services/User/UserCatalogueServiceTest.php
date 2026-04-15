<?php

namespace Tests\Feature\Services;
use Tests\Feature\Services\BaseServivesTest;
use App\Repositories\User\UserCatalogueRepo;
use App\Service\Interfaces\User\UserCatalogueServiceInterface as UserCatalogueService;
use Mockery;
use Illuminate\Support\Str;

class UserCatalogueServiceTest extends BaseServivesTest {

    protected function setUp(): void {
        parent::setUp();
        $this->repositoryMock = Mockery::mock(UserCatalogueRepo::class);
        $this->app->instance(UserCatalogueRepo::class, ($this->repositoryMock));
        $this->service = $this->app->make(UserCatalogueService::class);
    }

    protected function getDefaultRequestsData(array $overrides = []): array {
        return array_merge([
            'name' => 'test catalogue',
            'canonical' => 'test-catalogue',
            'description' => 'test description',    
            'publish' => 1,
        ], $overrides);
    }   

    protected function prepareExpectedData(array $requestData = []) : array {
        return array_merge([
            'name' => $requestData['name'],
            'canonical' => Str::slug($requestData['canonical']),
            'description' => $requestData['description'],
            'publish' => $requestData['publish'],
            'user_id' => $this->fakeAuth->id,
        ]);
    }

    protected function getWith(): array {
        return ['users', 'creators'];
    }
}