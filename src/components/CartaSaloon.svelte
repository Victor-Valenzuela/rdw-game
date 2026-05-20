<script>
  let { card, active = false } = $props();

  function getCardImage(card) {
    if (card.type === 'gold') return `/mesa/${card.value}pepas.webp`;
    if (card.type === 'extra_whisky') return '/mesa/tragowhisky.webp';
    if (card.type === 'extra_shot') return '/mesa/caja.webp';
    return null;
  }
</script>

<div class="carta" class:active class:empty={!card}>
  {#if card}
    {@const img = getCardImage(card)}
    {#if img}
      <img src={img} alt={card.type} class="carta-img" />
    {:else}
      <div class="placeholder-card">
        <span class="placeholder-icon">{card.type === 'extra_whisky' ? '🥃' : '📦'}</span>
        <span class="placeholder-label">{card.type === 'extra_whisky' ? 'WHISKY' : 'BALAS'}</span>
      </div>
    {/if}
  {:else}
    <span class="empty-slot">—</span>
  {/if}
</div>

<style>
  .carta {
    width: 90px;
    height: 130px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    border: none;
    overflow: hidden;
  }

  .carta.active {
    box-shadow: 0 0 12px rgba(218, 165, 32, 0.7), 0 0 4px rgba(218, 165, 32, 0.9);
    transform: translateY(-4px);
  }

  .carta.empty {
    opacity: 0.3;
    border-style: dashed;
    background: rgba(101, 67, 33, 0.3);
  }

  .carta-img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    border-radius: 8px;
  }

  .empty-slot {
    color: #666;
    font-size: 1.5rem;
  }

  .placeholder-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #5c3a1e 0%, #8b5e3c 100%);
    border-radius: 8px;
  }

  .placeholder-icon {
    font-size: 2.5rem;
  }

  .placeholder-label {
    font-size: 0.65rem;
    color: #daa520;
    font-weight: bold;
    text-transform: uppercase;
  }

  @media (min-width: 1024px) and (min-height: 768px) {
    .carta {
      width: 120px;
      height: 170px;
    }
  }
</style>
