<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonStructure(['metrics']);
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->customer()->create();
        $token = $customer->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/admin/dashboard')
            ->assertForbidden();
    }

    public function test_agent_can_access_agent_dashboard(): void
    {
        $agent = User::factory()->agent()->create();
        $token = $agent->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/agent/dashboard')
            ->assertOk();
    }

    public function test_customer_can_access_customer_dashboard(): void
    {
        $customer = User::factory()->customer()->create();
        $token = $customer->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/v1/customer/dashboard')
            ->assertOk();
    }
}
