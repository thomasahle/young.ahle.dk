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
  let linkPreviews = $state<Record<string, string | null>>({});

  async function fetchLinkPreview(url: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      );
      const data = await response.json();
      return data.data?.image?.url || null;
    } catch {
      return null;
    }
  }

  async function fetchAllLinkPreviews(items: WishItem[]) {
    const linksToFetch = items.filter(
      (item) => item.link && !linkPreviews[item.link],
    );

    await Promise.all(
      linksToFetch.map(async (item) => {
        const imageUrl = await fetchLinkPreview(item.link);
        linkPreviews[item.link] = imageUrl;
      }),
    );
  }

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

    // Fetch link previews for all items with links
    const allItems = results.flatMap((r) => r.items);
    fetchAllLinkPreviews(allItems);
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
          {@const imageUrl = wish.link && linkPreviews[wish.link]}
          <Card class="{wish.claimed ? 'opacity-60' : ''} overflow-hidden">
            <div class="flex">
              <div
                class="w-24 sm:w-28 flex-shrink-0 bg-muted/50 flex items-center justify-center"
              >
                {#if imageUrl}
                  <img
                    src={imageUrl}
                    alt={wish.item}
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <svg
                    class="w-10 h-10 text-muted-foreground/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    ></path>
                  </svg>
                {/if}
              </div>
              <div class="flex-1 flex flex-col justify-center min-w-0">
                <CardHeader class="py-3">
                  <div class="flex justify-between items-start gap-2">
                    <div class="flex-1 min-w-0">
                      <CardTitle
                        class="text-base sm:text-lg flex items-center gap-2 flex-wrap"
                      >
                        <span class="truncate">{wish.item}</span>
                        {#if wish.claimed}
                          <span
                            class="text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded whitespace-nowrap"
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
                      class="text-xs font-medium px-2 py-1 rounded flex-shrink-0 {getPriorityColor(
                        wish.priority,
                      )}"
                    >
                      {getPriorityLabel(wish.priority)}
                    </span>
                  </div>
                  {#if wish.link}
                    <Button
                      href={wish.link}
                      variant="outline"
                      size="sm"
                      target="_blank"
                      rel="noopener"
                      class="mt-2 w-fit"
                    >
                      Se link →
                    </Button>
                  {/if}
                </CardHeader>
              </div>
            </div>
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
