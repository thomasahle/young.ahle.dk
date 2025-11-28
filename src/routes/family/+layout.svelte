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

  async function handleLogin(e: Event) {
    e.preventDefault();
    error = "";

    const success = await auth.login(password);
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
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-muted-foreground">Indlæser...</p>
  </div>
{:else if !isAuthenticated}
  <div class="min-h-screen flex items-center justify-center p-8">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Familieområde</CardTitle>
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
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="border-b bg-background">
      <div
        class="container mx-auto px-4 py-3 flex justify-between items-center"
      >
        <div class="flex gap-4">
          <Button href="/family" variant="ghost">Hjem</Button>
          <Button href="/family/wishlists" variant="ghost">Ønskelister</Button>
        </div>
        <Button onclick={handleLogout} variant="outline" size="sm"
          >Log ud</Button
        >
      </div>
    </nav>

    <!-- Content -->
    <main class="container mx-auto px-4 py-8">
      {@render children()}
    </main>
  </div>
{/if}
