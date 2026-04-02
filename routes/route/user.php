<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\V1\User\UserCatalogueController;

Route::middleware(['auth', 'verified'])->group(function () {
   Route::delete('/backend/user_catalogue', [UserCatalogueController::class, 'bulkDestroy']);
   Route::put('/backend/user_catalogue', [UserCatalogueController::class, 'bulkUpdate']);
   Route::patch('/backend/user_catalogue', [UserCatalogueController::class, 'bulkUpdate']);
   Route::patch('/backend/user_catalogue/{id}/toggle/{field}', [UserCatalogueController::class, 'toggle']);
   Route::resource('/backend/user_catalogue', UserCatalogueController::class);
});

