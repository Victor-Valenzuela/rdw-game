<script>
  import CartaSaloon from '../CartaSaloon.svelte';
  let { display, saloonDeckLength, roundNumber, phase, slots, selectedCards, placements, playerKey, isConfirmed = false, selectedActions = null } = $props();

  function getActionImg(type) {
    if (type === 'loot') return '/jugador/loot4.webp';
    if (type === 'shoot') return '/jugador/shoot4.webp';
    return '/jugador/whisky.webp';
  }

  let myKey = $derived(playerKey === 'p1' ? 'p1' : (playerKey === 'p2' ? 'p2' : (playerKey === 0 ? 'p1' : 'p2')));
  let oppKey = $derived(playerKey === 'p1' ? 'p2' : (playerKey === 'p2' ? 'p1' : (playerKey === 0 ? 'p2' : 'p1')));
</script>

<div class="table-zone">
  <div class="saloon-row">
    <div class="round-badge">R{roundNumber} F{phase}</div>
    <div class="deck-stack">
      <div class="deck-card-back"><img src="/mesa/reverso.webp" alt="" class="deck-img" /></div>
      <span class="deck-count">{saloonDeckLength}</span>
    </div>
    <div class="display-cards">
      {#each display || [] as card, i}
        <div class="display-slot" class:active-slot={slots.includes(i)}>
          <!-- Rival arriba (fase anterior) -->
          <div class="played-card" class:visible={!slots.includes(i) && placements?.[i]}>
            {#if !slots.includes(i) && placements?.[i] && placements[i][oppKey]}
              <img src={getActionImg(placements[i][oppKey])} alt="" class="played-img" />
            {/if}
          </div>

          <CartaSaloon {card} active={slots.includes(i)} />

          <!-- Abajo: slot activo o carta jugada -->
          {#if slots.includes(i) && !isConfirmed}
            {@const slotIdx = slots[0] === i ? 0 : 1}
            <div class="action-slot" data-slot={i} class:filled={selectedCards[slotIdx]}>
              {#if selectedCards[slotIdx]}
                <img src={getActionImg(selectedCards[slotIdx].type)} alt="" class="slot-img" />
              {:else}<span class="slot-empty">?</span>{/if}
            </div>
          {:else if slots.includes(i) && isConfirmed && selectedActions}
            {@const slotIdx = slots[0] === i ? 0 : 1}
            <div class="action-slot filled" data-slot={i}>
              {#if selectedActions[slotIdx]}
                <img src={getActionImg(selectedActions[slotIdx])} alt="" class="slot-img" />
              {/if}
            </div>
          {:else}
            <div class="played-card" class:visible={placements?.[i]}>
              {#if placements?.[i] && placements[i][myKey]}
                <img src={getActionImg(placements[i][myKey])} alt="" class="played-img" />
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .table-zone { flex: 1; display: flex; align-items: center; justify-content: center; padding: 0.5rem; }
  .saloon-row { display: flex; align-items: center; gap: 0.8rem; }
  .round-badge { font-size: 0.65rem; color: #daa520; background: rgba(0,0,0,0.6); padding: 0.25rem 0.5rem; border-radius: 10px; border: 1px solid #654321; writing-mode: vertical-lr; transform: rotate(180deg); align-self: center; }
  .deck-stack { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  .deck-card-back { width: 90px; height: 130px; border-radius: 10px; }
  .deck-img { width: 100%; height: 100%; object-fit: contain; border-radius: 10px; }
  .deck-count { font-size: 0.7rem; color: #daa520; }
  .display-cards { display: flex; gap: 0.6rem; }
  .display-slot { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; position: relative; }
  .action-slot { width: 50px; height: 45px; background: rgba(101,67,33,0.4); border: 2px dashed #654321; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .action-slot.filled { border-style: solid; border-color: #daa520; background: rgba(139,69,19,0.5); }
  .slot-img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }
  .slot-empty { font-size: 1rem; opacity: 0.3; color: #f5deb3; }
  .played-card { width: 45px; height: 40px; border-radius: 6px; overflow: hidden; opacity: 0; }
  .played-card.visible { opacity: 0.6; }
  .played-img { width: 100%; height: 100%; object-fit: cover; border-radius: 6px; }

  @media (min-width: 1024px) and (min-height: 768px) {
    .deck-card-back { width: 120px; height: 170px; }
    .played-card { width: 55px; height: 50px; }
    .action-slot { width: 60px; height: 55px; }
  }
</style>
