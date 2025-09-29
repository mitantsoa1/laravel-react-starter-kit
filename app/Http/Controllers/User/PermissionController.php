<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all();
        return Inertia::render('permissions/index', ['permissions' => $permissions]);
    }

    public function create()
    {
        return Inertia::render('permissions/create');
    }

    public function edit($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('permissions/create', [
            'permission' => $permission,
            'isEditing' => true
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        $permission = Permission::create(['name' => $request->name]);
        // return response()->json(['permission' => $permission, 'message' => 'permission created successfully', 'status' => 'success'], Response::HTTP_CREATED);
        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully');
    }

    public function show(Permission $permission)
    {
        return Inertia::render('permissions/create', [
            'permission' => $permission,
            'isEditing' => true
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update(['name' => $request->name]);
        // return response()->json(['permission' => $permission, 'message' => 'permission updated successfully', 'status' => 'success'], Response::HTTP_OK);
        return redirect()->route('permissions.index')
            ->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        // return response()->json(['permission' => null, 'message' => 'permission deleted successfully', 'status' => 'success'], Response::HTTP_OK);
        return redirect()->route('permissions.index')
            ->with('success', 'Permission deleted successfully');
    }
}
