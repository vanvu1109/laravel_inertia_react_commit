<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\V1\User\UserCatalogueController;
use App\Http\Controllers\backend\V1\Permission\PermissionController;
use App\Http\Controllers\backend\V1\User\UserController;

Route::middleware(['auth', 'verified'])->group(function () {
   Route::delete('/backend/user_catalogue', [UserCatalogueController::class, 'bulkDestroy']);
   Route::put('/backend/user_catalogue', [UserCatalogueController::class, 'bulkUpdate']);
   Route::patch('/backend/user_catalogue', [UserCatalogueController::class, 'bulkUpdate']);
   Route::patch('/backend/user_catalogue/{id}/toggle/{field}', [UserCatalogueController::class, 'toggle']);
   Route::resource('/backend/user_catalogue', UserCatalogueController::class);

   Route::delete('/backend/permission', [PermissionController::class, 'bulkDestroy']);
   Route::put('/backend/permission', [PermissionController::class, 'bulkUpdate']);
   Route::patch('/backend/permission', [PermissionController::class, 'bulkUpdate']);
   Route::patch('/backend/permission/{id}/toggle/{field}', [PermissionController::class, 'toggle']);
   Route::resource('/backend/permission', PermissionController::class);

   Route::delete('/backend/user', [UserController::class, 'bulkDestroy']);
   Route::put('/backend/user', [UserController::class, 'bulkUpdate']);
   Route::patch('/backend/user', [UserController::class, 'bulkUpdate']);
   Route::patch('/backend/user/{id}/toggle/{field}', [UserController::class, 'toggle']);
   Route::resource('/backend/user', UserController::class);
});

