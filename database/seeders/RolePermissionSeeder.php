<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Réinitialiser le cache des permissions :cite[3]
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Créer des autorisations 
        $editUser = Permission::create(['name' => 'EDIT_USER']);
        $deleteUser = Permission::create(['name' => 'DELETE_USER']);
        $createUser = Permission::create(['name' => 'CREATE_USER']);
        $viewUser = Permission::create(['name' => 'ROLE_USER']);

        // Créer des rôles et leur assigner des autorisations 
        $writerRole = Role::create(['name' => 'WRITER']);
        $writerRole->givePermissionTo($editUser);

        $adminRole = Role::create(['name' => 'ROLE_ADMIN']);
        $adminRole->givePermissionTo($editUser, $deleteUser, $createUser);

        $roleRole = Role::create(['name' => 'ROLE_USER']);
        $roleRole->givePermissionTo($viewUser);


        $superAdminRole = Role::create(['name' => 'SUPER_ADMIN']);
        // Le Super-Admin peut avoir toutes les autorisations via une logique spécifique 
    }
}
