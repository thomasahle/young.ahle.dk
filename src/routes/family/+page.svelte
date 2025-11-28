<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";

  const links = [
    {
      title: "Ønskelister",
      description: "Se og rediger familiens ønskelister",
      href: "/family/wishlists",
      icon: "🎁",
    },
    {
      title: "Kalender",
      description: "Familiens kalender",
      href: "#",
      icon: "📅",
      external: true,
    },
    {
      title: "Fotos",
      description: "Familiebilleder og albums",
      href: "#",
      icon: "📷",
      external: true,
    },
    {
      title: "Opskrifter",
      description: "Familiens opskrifter",
      href: "#",
      icon: "🍳",
      external: true,
    },
    {
      title: "Stamtræ",
      description: "Familiens stamtræ",
      href: "#",
      icon: "🌳",
      external: true,
    },
    {
      title: "Baby Tracker",
      description: "Babys milepæle og vækst",
      href: "#",
      icon: "👶",
      external: true,
    },
  ];
</script>

<div class="max-w-4xl mx-auto">
  <h1 class="text-3xl font-bold mb-2">Velkommen til familiesiden</h1>
  <p class="text-muted-foreground mb-8">
    Her finder du alt om Young Ahle familien
  </p>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each links as link}
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div class="text-3xl mb-2">{link.icon}</div>
          <CardTitle class="text-lg">{link.title}</CardTitle>
          <CardDescription>{link.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {#if link.href === "#"}
            <Button variant="secondary" class="w-full" disabled>
              Kommer snart
            </Button>
          {:else if link.external}
            <Button
              href={link.href}
              variant="outline"
              class="w-full"
              target="_blank"
            >
              Åbn →
            </Button>
          {:else}
            <Button href={link.href} class="w-full">Åbn</Button>
          {/if}
        </CardContent>
      </Card>
    {/each}
  </div>
</div>
