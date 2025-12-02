<script lang="ts">
  import { auth } from "$lib/auth";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";
  import { onMount } from "svelte";

  let { children } = $props();

  let password = $state("");
  let error = $state("");
  let isAuthenticated = $state(false);
  let isLoading = $state(true);

  onMount(() => {
    isAuthenticated = auth.check();
    isLoading = false;
  });

  function handleLogin(e: Event) {
    e.preventDefault();
    error = "";

    const success = auth.login(password);
    if (success) {
      isAuthenticated = true;
    } else {
      error = "Forkert kodeord";
      password = "";
    }
  }

  function handleLogout() {
    auth.logout();
    isAuthenticated = false;
  }
</script>

<svelte:head>
  <title>Familie - Young Ahle</title>
</svelte:head>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center gradient-hero">
    <p class="text-white/80">Indlæser...</p>
  </div>
{:else if !isAuthenticated}
  <div class="min-h-screen flex items-center justify-center p-8 gradient-hero">
    <Card class="w-full max-w-sm shadow-2xl">
      <CardHeader class="text-center">
        <div class="text-4xl mb-2">🏠</div>
        <CardTitle class="text-xl">Familieområde</CardTitle>
        <CardDescription
          >Indtast familiens kodeord for at fortsætte</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form onsubmit={handleLogin} class="space-y-4">
          <Input
            type="password"
            placeholder="Kodeord"
            bind:value={password}
            autocomplete="current-password"
          />
          {#if error}
            <p class="text-sm text-destructive">{error}</p>
          {/if}
          <Button type="submit" class="w-full">Log ind</Button>
        </form>
        <div class="mt-4 text-center">
          <Button href="/" variant="ghost" size="sm"
            >← Tilbage til forsiden</Button
          >
        </div>
      </CardContent>
    </Card>
  </div>
{:else}
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="gradient-hero shadow-md">
      <div
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <div class="flex gap-2">
          <Button
            href="/family"
            variant="ghost"
            class="text-white hover:bg-white/20 hover:text-white"
          >
            🏠 Hjem
          </Button>
          <Button
            href="/family/wishlists"
            variant="ghost"
            class="text-white hover:bg-white/20 hover:text-white"
          >
            🎁 Ønskelister
          </Button>
        </div>
        <Button
          onclick={handleLogout}
          variant="outline"
          size="sm"
          class="bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          Log ud
        </Button>
      </div>
    </nav>

    <!-- Content -->
    <main class="flex-1 container mx-auto px-4 py-8">
      {@render children()}
    </main>
  </div>
{/if}
