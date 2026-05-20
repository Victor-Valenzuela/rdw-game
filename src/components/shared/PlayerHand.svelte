<script>
  import { ACTION_NAMES } from '../../lib/gameLogic.js';
  let { cards, selectedCards, disabled = false, oncardclick, onremove } = $props();

  function getActionImg(type) {
    if (type === 'loot') return '/jugador/loot4.png';
    if (type === 'shoot') return '/jugador/shoot4.png';
    return '/jugador/whisky.png';
  }
</script>

<div class="player-hand">
  {#each cards as card}
    {@const isSelected = selectedCards[0]?.id === card.id || selectedCards[1]?.id === card.id}
    <button
      class="hand-card"
      class:selected={isSelected}
      onclick={(e) => isSelected ? onremove(card) : oncardclick(card, e)}
      disabled={disabled}
    >
      <img src={getActionImg(card.type)} alt={ACTION_NAMES[card.type]} class="card-img" />
      {#if isSelected}<span class="card-overlay">X</span>{/if}
    </button>
  {/each}
</div>

<style>
  .player-hand { display: flex; gap: 0.5rem; justify-content: center; }
  .hand-card { width: 110px; height: 155px; background: rgba(139,69,19,0.5); border: 2px solid #654321; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #f5deb3; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; padding: 0; }
  .hand-card:hover:not(.selected):not(:disabled) { border-color: #daa520; transform: translateY(-6px); }
  .hand-card.selected { border-color: #daa520; background: rgba(139,0,0,0.5); }
  .hand-card:disabled { opacity: 0.6; cursor: default; }
  .card-img { width: 100%; height: 100%; object-fit: fill; border-radius: 8px; }
  .card-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.6); border-radius: 6px; font-size: 1.4rem; color: #ff6b6b; font-weight: bold; }
</style>
