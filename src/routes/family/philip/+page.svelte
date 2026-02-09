<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";

  const birthStats = {
    date: "2025",
    weight: "3.667 g",
    height: "54 cm",
  };

  const milestones = [
    {
      age: "0-3 mdr.",
      title: "Nyfødt",
      items: [
        "Første smil",
        "Løfter hovedet",
        "Følger genstande med øjnene",
        "Reagerer på lyde",
      ],
    },
    {
      age: "3-6 mdr.",
      title: "Opdagelse",
      items: [
        "Ruller rundt",
        "Griber efter legetøj",
        "Griner højt",
        "Genkender ansigter",
      ],
    },
    {
      age: "6-9 mdr.",
      title: "Udforskning",
      items: [
        "Sidder selv",
        "Kravler",
        "Siger 'mama' / 'dada'",
        "Vinker farvel",
      ],
    },
    {
      age: "9-12 mdr.",
      title: "De første skridt",
      items: [
        "Rejser sig op",
        "Første skridt",
        "Første ord",
        "Spiser selv med fingrene",
      ],
    },
  ];
</script>

<svelte:head>
  <title>Philip Tracker - Young Ahle</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <div class="text-5xl mb-3">👶</div>
    <h1 class="text-3xl font-bold mb-2">Philip</h1>
    <p class="text-muted-foreground">Milepæle og vækst</p>
  </div>

  <!-- Birth Stats -->
  <Card class="mb-6 border-primary/20 shadow-md">
    <CardHeader>
      <CardTitle class="text-lg">Fødsel</CardTitle>
      <CardDescription>Philips første tal</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="rounded-lg bg-secondary/50 p-4">
          <div class="text-2xl font-bold text-primary">{birthStats.weight}</div>
          <div class="text-sm text-muted-foreground mt-1">Fødselsvægt</div>
        </div>
        <div class="rounded-lg bg-secondary/50 p-4">
          <div class="text-2xl font-bold text-primary">{birthStats.height}</div>
          <div class="text-sm text-muted-foreground mt-1">Længde</div>
        </div>
        <div class="rounded-lg bg-secondary/50 p-4">
          <div class="text-2xl font-bold text-primary">{birthStats.date}</div>
          <div class="text-sm text-muted-foreground mt-1">Fødselsår</div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Photos Link -->
  <Card class="mb-6 hover:shadow-lg transition-shadow">
    <CardContent class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="text-3xl">📸</div>
          <div>
            <h3 class="font-semibold">Billeder af Philip</h3>
            <p class="text-sm text-muted-foreground">
              Se alle billeder i Google Fotos
            </p>
          </div>
        </div>
        <Button
          href="https://photos.app.goo.gl/Urci8YBqt2zBC9mH8"
          variant="outline"
          target="_blank"
        >
          Se billeder →
        </Button>
      </div>
    </CardContent>
  </Card>

  <!-- Milestones -->
  <h2 class="text-xl font-bold mb-4">Milepæle</h2>
  <div class="grid gap-4 md:grid-cols-2">
    {#each milestones as milestone}
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader class="pb-3">
          <div
            class="text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 w-fit"
          >
            {milestone.age}
          </div>
          <CardTitle class="text-lg">{milestone.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2">
            {#each milestone.items as item}
              <li class="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  class="w-5 h-5 rounded-full border-2 border-border flex-shrink-0"
                ></span>
                {item}
              </li>
            {/each}
          </ul>
        </CardContent>
      </Card>
    {/each}
  </div>
</div>
