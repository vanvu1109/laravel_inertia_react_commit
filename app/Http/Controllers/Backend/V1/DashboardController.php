<?php
namespace App\Http\Controllers\Backend\V1;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('backend/dashboard');
    }
}