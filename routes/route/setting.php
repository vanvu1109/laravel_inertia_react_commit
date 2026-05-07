<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\backend\V1\Setting\LanguageController;

Route::prefix('backend')->middleware(['auth', 'verified'])->group(function () {
   Route::delete('/language', [LanguageController::class, 'bulkDestroy']);
   Route::put('/language', [LanguageController::class, 'bulkUpdate']);
   Route::patch('/language', [LanguageController::class, 'bulkUpdate']);
   Route::patch('/language/{id}/toggle/{field}', [LanguageController::class, 'toggle']);
   Route::resource('/language', LanguageController::class);
});
