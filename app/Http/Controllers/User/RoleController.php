<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{


    public function index()
    {
        $roles = Role::with('permissions')->get();
        return Inertia::render('roles/index', [
            'roles' => $roles
        ]);
    }

    public function create()
    {
        return Inertia::render('roles/create', [
            'permissions' => Permission::all(),
            'isEditing' => false
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'unique:roles'],
            'permissions' => ['required', 'array']
        ]);

        $role = Role::create(['name' => strtoupper($request->name)]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully');
    }

    public function edit(Role $role)
    {
        return Inertia::render('roles/create', [
            'role' => $role,
            'permissions' => $role->permissions,
            'isEditing' => true,
            'allPermissions' => Permission::all()
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => ['required', 'string', 'unique:roles,name,' . $role->id],
            // 'permissions' => ['required', 'array']
        ]);
        try {
            $role->update(['name' => strtoupper($request->name)]);
            $role->syncPermissions($request->permissions);

            return redirect()->route('roles.index')
                ->with('success', 'Role updated successfully');
        } catch (\Exception $e) {
            return redirect()->route('roles.index')
                ->with('error', 'Role not found');
        }
    }

    public function destroy(Role $role)
    {
        if (in_array($role->name, ['SUPER_ADMIN'])) {

            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete this role');
        }
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully');
    }
}
