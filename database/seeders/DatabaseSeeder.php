<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(RolePermissionSeeder::class);

        $superAdmin = User::firstOrCreate(
            [
                'email' => 'superadmin@admin.com',
                'name' => 'Super Admin',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );
        $admin = User::Create(
            [
                'email' => 'admin@admin.com',
                'name' => 'Admin',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('SUPER_ADMIN');
        $admin->assignRole('ROLE_ADMIN');
    }
}
