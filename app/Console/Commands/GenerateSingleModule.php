<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Traits\HasGenerate;
class GenerateSingleModule extends Command
{   
    use HasGenerate;
    protected $module;
    protected $namespace;
    protected $version;
    protected $table;
    protected $moduleName;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:crud {module} {--namespace=: The namespace of the module} {--v=: The version of the module} {--table=: The table of the module} {--moduleName=: The name of the module}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

    protected function setModule(string $module = ''): static{
        $this->module = $module;
        return $this;
    }

    protected function setNamespace(string $namespace = ''): static{
        $this->namespace = $namespace;
        return $this;
    }

    protected function setVersion(string $version = 'V1'): static{
        $this->version = $version;
        return $this;
    }

    protected function setTable(string $table = ''): static{
        $this->table = $table;
        return $this;
    }
    
    protected function setModuleName(string $moduleName = ''): static{
        $this->moduleName = $moduleName;
        return $this;
    }

    public function handle()
    {
        try{
            $this->setModule($this->argument('module'))
            ->setNamespace($this->option('namespace'))
            ->setVersion($this->option('v'))
            ->setTable($this->option('table'))
            ->setModuleName($this->option('moduleName'))
            ->generateController()
            ->generateService()
            ->generateRepository()
            ->generateModel()
            ->generateRequest()
            ->generateServiceiInterface()
            ->generateView()
            ->generateMigration()
            ->generatePermissionData();

            
        }catch(\Throwable $th){
            $this->error("Có lỗi xảy ra: " .$th->getMessage());
            return Command::FAILURE;
        }
    }

}
