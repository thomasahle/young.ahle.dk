<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";
  import {
    fetchWishlist,
    familyMembers,
    SHEET_URL,
    type WishItem,
  } from "$lib/sheets";

  let activeTab = $state(familyMembers[0].sheetName);
  let wishlists = $state<Record<string, WishItem[]>>({});
  let loading = $state(true);

  function setActiveTab(tab: string) {
    activeTab = tab;
    if (browser) {
      window.location.hash = tab;
    }
  }

  onMount(async () => {
    // Restore tab from URL hash
    const hash = window.location.hash.slice(1);
    if (hash && familyMembers.some((m) => m.sheetName === hash)) {
      activeTab = hash;
    }

    // Fetch all wishlists in parallel
    const results = await Promise.all(
      familyMembers.map(async (member) => ({
        name: member.sheetName,
        items: await fetchWishlist(member.sheetName),
      })),
    );

    wishlists = Object.fromEntries(results.map((r) => [r.name, r.items]));
    loading = false;
  });

  function getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  }

  function getPriorityLabel(priority: string): string {
    switch (priority.toLowerCase()) {
      case "high":
        return "Høj";
      case "low":
        return "Lav";
      default:
        return "Medium";
    }
  }
</script>

<div class="max-w-4xl mx-auto">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h1 class="text-3xl font-bold">Ønskelister</h1>
      <p class="text-muted-foreground">
        Familiens ønsker til fødselsdag og jul
      </p>
    </div>
  </div>

  <!-- Tabs -->
  <div class="flex gap-2 mb-6 border-b">
    {#each familyMembers as member}
      <button
        onclick={() => setActiveTab(member.sheetName)}
        class="px-4 py-2 font-medium transition-colors border-b-2 -mb-px {activeTab ===
        member.sheetName
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'}"
      >
        {member.name}
      </button>
    {/each}
  </div>

  <!-- Wishlist Content -->
  {#if loading}
    <div class="text-center py-12">
      <p class="text-muted-foreground">Indlæser ønskeliste...</p>
    </div>
  {:else}
    {@const items = wishlists[activeTab] || []}
    {#if items.length === 0}
      <Card>
        <CardContent class="py-12 text-center">
          <p class="text-muted-foreground">Ingen ønsker endnu</p>
        </CardContent>
      </Card>
    {:else}
      <div class="grid gap-4">
        {#each items as wish}
          <Card class={wish.claimed ? "opacity-60" : ""}>
            <CardHeader class="pb-2">
              <div class="flex justify-between items-start gap-4">
                <div class="flex-1">
                  <CardTitle class="text-lg flex items-center gap-2">
                    {wish.item}
                    {#if wish.claimed}
                      <span
                        class="text-sm font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded"
                      >
                        Reserveret
                      </span>
                    {/if}
                  </CardTitle>
                  {#if wish.description}
                    <CardDescription class="mt-1"
                      >{wish.description}</CardDescription
                    >
                  {/if}
                </div>
                <span
                  class="text-xs font-medium px-2 py-1 rounded {getPriorityColor(
                    wish.priority,
                  )}"
                >
                  {getPriorityLabel(wish.priority)}
                </span>
              </div>
            </CardHeader>
            {#if wish.link}
              <CardContent class="pt-2">
                <Button
                  href={wish.link}
                  variant="outline"
                  size="sm"
                  target="_blank"
                  rel="noopener"
                >
                  Se link →
                </Button>
              </CardContent>
            {/if}
          </Card>
        {/each}
      </div>
    {/if}

    <div class="mt-8 p-4 bg-muted rounded-lg">
      <p class="text-sm text-muted-foreground">
        <strong>Tip:</strong> For at tilføje eller redigere ønsker, eller for at
        markere et ønske som reserveret, skal du redigere i
        <a
          href={SHEET_URL}
          target="_blank"
          rel="noopener"
          class="underline hover:text-foreground">Google Sheet</a
        >.
      </p>
    </div>
  {/if}
</div>
