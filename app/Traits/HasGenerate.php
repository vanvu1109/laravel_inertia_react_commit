<?php

namespace App\Traits;

use App\Models\Permission;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
trait HasGenerate
{
    public function getStubs(string $filepath = ''){
        return File::get(resource_path("stubs/{$filepath}.stub"));
    }

    private function put($content, $destination){
        File::put($destination, $content);
    }

    public function createContent($content, ?array $extends = []){
        $newContent = str_replace(
            [
                '{{namespace}}',
                '{{module}}',
                '{{version}}',
                ...(isset($extends[0]) ? $extends[0] : []),
            ],
            [
                $this->namespace,
                $this->module,
                $this->version,
                ...(isset($extends[1]) ? $extends[1] : []),
            ],
            $content
        );

        return $newContent;
    }

    private function generateController(): static {
        $stub = $this->getStubs('controller');
        $target = app_path("Http/Controllers/Backend/{$this->version}/{$this->namespace}");
        $destination = ("{$target}/{$this->module}Controller.php");
        File::ensureDirectoryExists($target);
        $snake_module = Str::snake($this->module);
        $snake_namespace = Str::snake($this->namespace);


        $extends = [
            [
                '{{snake_namespace}}',
                '{{snake_module}}',
            ],
            [
                $snake_namespace,
                $snake_module,
            ],
        ];

        $content = $this->createContent($stub, $extends);
        $this->put($content, $destination);
        return $this;
    }

    private function generateService():static{
        $stub = $this->getStubs('service');
        $target = app_path("Service/Impl/{$this->version}/{$this->namespace}");
        $destination = ("{$target}/{$this->module}Service.php");
        File::ensureDirectoryExists($target);
         $extends = [
            [
                '{{namespace}}',
                '{{module}}',
                '{{version}}',
            ],
            [
                $this->namespace,
                $this->module,
                $this->version,
            ],
        ];

        $content = $this->createContent($stub, $extends);
        $this->put($content, $destination);
        return $this;
    }

    private function generateRepository():static{
        $stub = $this->getStubs('repository');
        $target = app_path("Repositories/{$this->namespace}");
        $destination = ("{$target}/{$this->module}Repo.php");
        File::ensureDirectoryExists($target);
        $extends = [
            [
                '{{namespace}}',
                '{{module}}',
            ],
            [
                $this->namespace,
                $this->module,
            ],
        ];

        $content = $this->createContent($stub, $extends);
        $this->put($content, $destination);
        return $this;
    }

    private function generateModel():static {
        $stub = $this->getStubs('model');
        $target = app_path("Models");
        $destination = ("{$target}/{$this->module}.php");
        File::ensureDirectoryExists($target);
        $extends = [
            [
                '{{namespace}}',
            ],
            [
                $this->namespace,
            ],
        ];
        $content = $this->createContent($stub, $extends);
        $this->put($content, $destination);
        return $this;
    }

    private function generateRequest(): static{
        $stubs = [
            'StoreRequest' => resource_path('stubs/common/StoreRequest.stub'),
            'UpdateRequest' => resource_path('stubs/common/UpdateRequest.stub'),
            'BulkDestroyRequest' => resource_path('stubs/common/BulkDestroyRequest.stub'),
            'BulkUpdateRequest' => resource_path('stubs/common/BulkUpdateRequest.stub'),
        ];  

        foreach($stubs as $stub => $path){
            $target = app_path("Http/Requests/{$this->namespace}/{$this->module}");
            $destination = ("{$target}/{$stub}.php");
            File::ensureDirectoryExists($target);
            $snake_module = Str::snake($this->module);
            $extends = [
                [   
                    '{{snake_module}}', 
                ],
                [       
                    $snake_module,
                ],
            ];
            $content = $this->createContent(File::get($path), $extends);
            $this->put($content, $destination);
        }

        return $this;

    }

    private function generateServiceiInterface(): static {
        $stub = $this->getStubs('service-interface');
        $target = app_path("Service/Interfaces/{$this->namespace}");
        $destination = ("{$target}/{$this->module}ServiceInterface.php");
        File::ensureDirectoryExists($target);
        $content = $this->createContent($stub, null);
        $this->put($content, $destination);
        return $this;
    }

    private function generateView():static{
        $snake_module = Str::snake($this->module);
        $snake_namespace = Str::snake($this->namespace);
        $target = resource_path("js/pages/backend/{$snake_namespace}/{$snake_module}");
        File::ensureDirectoryExists($target);
        
        $stub = ['index', 'save'];
        $extends = [
            [
                '{{snake_namespace}}',
                '{{snake_module}}',
                '{{module_name}}',
            ],
            [
                $snake_namespace,
                $snake_module,
                $this->moduleName,
            ],
        ];

        foreach($stub as $key => $fileName){
            $stub = $this->getStubs('common/'.$fileName);
            $destination = ("{$target}/{$fileName}.tsx");
            $content = $this->createContent($stub, $extends);
            $this->put($content, $destination);
        }

        return $this;
    }


    private function generateMigration():static{
        $fileName = 'common/migration';
        $stub = $this->getStubs($fileName);
        $timestamp = date('Y_m_d_His');
        $migrationName = "create_{$this->table}_table";
        $migrationFileName = "{$timestamp}_{$migrationName}.php";
        $target = database_path("migrations/{$migrationFileName}");
        $snake_module = Str::snake($this->module);
        $extends = [
            [
                '{{snake_module}}',
            ],
            [
                $snake_module,
            ],
        ];
        $content = $this->createContent($stub, $extends);
        $this->put($content, $target);
        return $this;
    }


    private function generatePermissionData(){
        try{
            DB::beginTransaction();
            $snake_module = Str::snake($this->module);
            $display_name = $this->moduleName ?: $snake_module;


            $permissions = [
                [
                    'name' => "Xem danh sách {$display_name}",
                    'canonical' => "{$snake_module}:index",
                    'publish' => 2,
                    'description' => "Cho phép xem danh sách {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
                [
                    'name' => "Tạo mới {$display_name}",
                    'canonical' => "{$snake_module}:store",
                    'publish' => 2,
                    'description' => "Cho phép tạo mới {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
                [
                    'name' => "Cập nhật {$display_name}",
                    'canonical' => "{$snake_module}:update",
                    'publish' => 2,
                    'description' => "Cho phép cập nhật danh sách {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
                [
                    'name' => "Xoá {$display_name}",
                    'canonical' => "{$snake_module}:destroy",
                    'publish' => 2,
                    'description' => "Cho phép xoá danh sách {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
                [
                    'name' => "Cập nhật nhiều bản ghi {$display_name}",
                    'canonical' => "{$snake_module}:bulkUpdate",
                    'publish' => 2,
                    'description' => "Cho phép xoá danh sách {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
                [
                    'name' => "Xoá nhiều bản ghi {$display_name}",
                    'canonical' => "{$snake_module}:bulkDestroy",
                    'publish' => 2,
                    'description' => "Cho phép xoá nhiều danh sách {$display_name}",
                    'created_at' => now(),
                    'updated_at' => now(),
                    'user_id' => 1
                ],
            ];

            foreach($permissions as $permission){
                Permission::insertOrIgnore($permission);
            }

            DB::commit();
        }catch(\Throwable $th){
            DB::rollBack();
        }
    }
}