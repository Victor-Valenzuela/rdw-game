<script>
  let { flyingCard } = $props();

  function getActionImg(type) {
    if (type === 'loot') return '/jugador/loot4.png';
    if (type === 'shoot') return '/jugador/shoot4.png';
    return '/jugador/whisky.png';
  }
</script>

{#if flyingCard}
  <div
    class="flying-card"
    style="--from-x:{flyingCard.fromRect.left + flyingCard.fromRect.width/2}px;--from-y:{flyingCard.fromRect.top + flyingCard.fromRect.height/2}px;--to-x:{flyingCard.toRect.left + flyingCard.toRect.width/2}px;--to-y:{flyingCard.toRect.top + flyingCard.toRect.height/2}px;"
  >
    <img src={getActionImg(flyingCard.cardType)} alt="" class="flying-img" />
  </div>
{/if}

<style>
  .flying-card { position: fixed; z-index: 1000; width: 50px; height: 45px; border-radius: 8px; overflow: hidden; pointer-events: none; animation: flyToSlot 0.35s ease-out forwards; left: 0; top: 0; }
  .flying-img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
  @keyframes flyToSlot { 0% { transform: translate(calc(var(--from-x) - 25px), calc(var(--from-y) - 22px)) scale(1.2); opacity: 1; } 100% { transform: translate(calc(var(--to-x) - 25px), calc(var(--to-y) - 22px)) scale(1); opacity: 1; } }
</style>
