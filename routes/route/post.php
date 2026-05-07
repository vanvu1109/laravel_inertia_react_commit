<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\backend\V1\Post\PostCatalogueController;

Route::prefix('backend')->middleware(['auth', 'verified'])->group(function () {
   Route::delete('/post_catalogue', [PostCatalogueController::class, 'bulkDestroy']);
   Route::put('/post_catalogue', [PostCatalogueController::class, 'bulkUpdate']);
   Route::patch('/post_catalogue', [PostCatalogueController::class, 'bulkUpdate']);
   Route::patch('/post_catalogue/{id}/toggle/{field}', [PostCatalogueController::class, 'toggle']);
   Route::resource('/post_catalogue', PostCatalogueController::class);
});
