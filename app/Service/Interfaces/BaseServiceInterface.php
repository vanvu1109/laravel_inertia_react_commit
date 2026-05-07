<?php
namespace App\Service\Interfaces;
use Illuminate\Http\Request;

interface BaseServiceInterface {
    public function save(Request $request, ?int $id = null);
    public function show($id);
    public function paginate(Request $request);
    public function destroy(int $id);
    public function bulkDestroy(Request $request);
    public function bulkUpdate(Request $request);
    public function setWith(array $with = []);
}