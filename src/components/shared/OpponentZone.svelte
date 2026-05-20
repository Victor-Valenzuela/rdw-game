<script>
  import StatsRow from './StatsRow.svelte';
  let { name, gold, bullets, whiskyCount, hasBottle, cardCount, onleave = null } = $props();
</script>

<div class="opponent-zone">
  {#if onleave}
    <div class="top-bar"><button onclick={onleave} class="btn-exit">X</button></div>
  {/if}
  <div class="opponent-cards">
    {#each Array(cardCount) as _}
      <div class="card-back"><img src="/mesa/reverso.webp" alt="" class="card-back-img" /></div>
    {/each}
  </div>
  <StatsRow {name} {gold} {bullets} {whiskyCount} {hasBottle} />
</div>

<style>
  .opponent-zone { padding: 0.8rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .top-bar { width: 100%; display: flex; justify-content: flex-end; }
  .btn-exit { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,107,107,0.2); border: 1px solid #ff6b6b; color: #ff6b6b; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .btn-exit:hover { background: rgba(255,107,107,0.4); }
  .opponent-cards { display: flex; gap: 0.4rem; justify-content: center; }
  .card-back { width: 50px; height: 68px; border-radius: 6px; }
  .card-back-img { width: 100%; height: 100%; object-fit: contain; border-radius: 6px; }
</style>
