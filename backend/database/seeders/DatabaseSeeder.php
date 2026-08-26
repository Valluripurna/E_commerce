<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@ecommerce.test',
            'password' => Hash::make('Password1'),
            'role' => User::ROLE_ADMIN,
            'is_active' => true,
        ]);

        $agent = User::create([
            'name' => 'Delivery Agent',
            'email' => 'agent@ecommerce.test',
            'password' => Hash::make('Password1'),
            'role' => User::ROLE_AGENT,
            'phone' => '+1234567890',
            'is_active' => true,
        ]);

        $customer = User::create([
            'name' => 'Demo Customer',
            'email' => 'customer@ecommerce.test',
            'password' => Hash::make('Password1'),
            'role' => User::ROLE_CUSTOMER,
            'is_active' => true,
        ]);

        Cart::create(['user_id' => $customer->id]);
        Wishlist::create(['user_id' => $customer->id]);

        $this->call(ProductSeeder::class);
    }
}
