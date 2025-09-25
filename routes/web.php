<?php

use App\Http\Controllers\User\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/unauthorized', function () {
    return Inertia::render('unauthorized');
})->name('unauthorized');
Route::get('/not-found', function () {
    return Inertia::render('not-found');
})->name('not-found');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class)->names([
        'index' => 'users.index',
        'create' => 'users.create',
        'store' => 'users.store',
        'edit' => 'users.edit',
        'update' => 'users.update',
        'destroy' => 'users.destroy',
    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
