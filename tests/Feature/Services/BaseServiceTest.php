<?php

namespace Tests\Feature\Services;
use Tests\TestCase;
use Mockery;
use Mockery\MockInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Mockery\Mock;
use Tests\Fakes\Fakemodel;
abstract class BaseServivesTest extends TestCase {
    protected $service;
    protected MockInterface $repositoryMock;
    protected $fakeAuth;

    protected function setUp(): void
    {
        parent::setUp();
        $this->fakeAuth = (object) [
            'id' => 1
        ];
        Auth::shouldReceive('id')->andReturn($this->fakeAuth->id);
        Auth::shouldReceive('user')->andReturn($this->fakeAuth);


        /** MOCK DB */

        DB::shouldReceive('beginTransaction')->andReturn(true);
        DB::shouldReceive('commit')->andReturn(true);
        DB::shouldReceive('rollBack')->andReturn(true);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test create method
     *
     * @return void
     */
    
    public function test_luu_ban_ghi_moi_tahnh_cong() {
        $requestData = $this->getDefaultRequestsData();
        $request = new Request($requestData);
        $expectedData = $this->prepareExpectedData($requestData);
        $this->repositoryMock->shouldReceive('getFillable')->andReturn(array_keys($expectedData));
        $this->repositoryMock->shouldReceive('getRelationable')->andReturn([]);
        $mockModel = new Fakemodel(['id' => 1]);
        $this->repositoryMock->shouldReceive('create')->with($expectedData)->andReturn($mockModel);
        $result = $this->service->save($request);
        $this->assertEquals(1, $result->id);
    }

    public function test_luu_ban_ghi_that_bai_khi_repo_throws_exception() {
        $requestData = $this->getDefaultRequestsData();
        $request = new Request($requestData);
        $expectedData = $this->prepareExpectedData($requestData);
        $this->repositoryMock->shouldReceive('getFillable')->andReturn(array_keys($expectedData));
        $this->repositoryMock->shouldReceive('getRelationable')->andReturn([]);
        $this->repositoryMock->shouldReceive('create')->andThrow(new \Exception('error'));
        $result = $this->service->save($request);
        $this->assertEquals(false, $result);
    }

    public function test_cap_nhat_ban_ghi_thanh_cong() {
        $id = 1;
        $requestData = $this->getDefaultRequestsData(['name' => 'Updated name']);
        $request = new Request($requestData);
        $expectedData = $this->prepareExpectedData($requestData);
        $expectedData['user_id'] = 1;
        $this->repositoryMock->shouldReceive('getFillable')->andReturn(array_keys($expectedData));
        $this->repositoryMock->shouldReceive('getRelationable')->andReturn([]);
        $mockModel = new Fakemodel(['id' => 1]);
        $this->repositoryMock->shouldReceive('update')->with($id, Mockery::subset($expectedData))->andReturn($mockModel);
        $result = $this->service->save($request, $id);
        $this->assertEquals(1, $result->id);
    }   

    protected abstract function getDefaultRequestsData(array $overrides = []);
    protected abstract function prepareExpectedData(array $requestData = []);
}