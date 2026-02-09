<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let imageError = $state(false);

  function getSeason(): string {
    const month = new Date().getMonth(); // 0-11
    if (month >= 2 && month <= 4) return "spring"; // Mar-May
    if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
    if (month >= 8 && month <= 10) return "fall"; // Sep-Nov
    return "winter"; // Dec-Feb
  }

  const season = getSeason();
  const photoPath = `/photos/${season}.jpg`;

  function handleImageError() {
    imageError = true;
  }
</script>

<svelte:head>
  <title>Young Ahle</title>
</svelte:head>

<div
  class="min-h-screen flex flex-col items-center justify-center p-8 gradient-hero"
>
  <!-- Family Photo -->
  <div
    class="w-full max-w-2xl aspect-[4/3] mb-8 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur flex items-center justify-center"
  >
    {#if !imageError}
      <img
        src={photoPath}
        alt="Young Ahle familien"
        class="w-full h-full object-cover"
        onerror={handleImageError}
      />
    {:else}
      <div
        class="flex items-center justify-center text-white/70 text-center p-8"
      >
        <p>
          Tilføj sæsonbilleder til:<br />
          <code class="text-sm bg-white/20 px-2 py-1 rounded block mt-2"
            >static/photos/spring.jpg</code
          >
          <code class="text-sm bg-white/20 px-2 py-1 rounded block mt-1"
            >static/photos/summer.jpg</code
          >
          <code class="text-sm bg-white/20 px-2 py-1 rounded block mt-1"
            >static/photos/fall.jpg</code
          >
          <code class="text-sm bg-white/20 px-2 py-1 rounded block mt-1"
            >static/photos/winter.jpg</code
          >
        </p>
      </div>
    {/if}
  </div>

  <!-- Welcome Text -->
  <h1 class="text-4xl font-bold mb-4 text-center text-white">
    Velkommen til Young Ahle
  </h1>
  <p class="text-lg text-white/80 mb-8 text-center max-w-md">
    Amy, Thomas & Philip
  </p>

  <!-- Enter Button -->
  <Button
    href="/family"
    size="lg"
    class="text-lg px-8 bg-white text-purple-700 hover:bg-white/90 shadow-lg"
  >
    Gå til familiesiden
  </Button>
</div>
