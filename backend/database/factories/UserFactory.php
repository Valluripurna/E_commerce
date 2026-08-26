<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password = null;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('Password1'),
            'role' => User::ROLE_CUSTOMER,
            'phone' => fake()->phoneNumber(),
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => User::ROLE_ADMIN]);
    }

    public function agent(): static
    {
        return $this->state(fn () => ['role' => User::ROLE_AGENT]);
    }

    public function customer(): static
    {
        return $this->state(fn () => ['role' => User::ROLE_CUSTOMER]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            if ($user->isCustomer()) {
                Cart::create(['user_id' => $user->id]);
                Wishlist::create(['user_id' => $user->id]);
            }
        });
    }
}
