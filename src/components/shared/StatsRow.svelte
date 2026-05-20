<script>
  import { WIN_CONDITIONS } from '../../lib/gameLogic.js';
  let { name, gold, bullets, whiskyCount, hasBottle, showMax = false } = $props();
</script>

<div class="stats-container">
  <span class="player-name">{name}</span>
  <div class="stats-row">
    <span><img src="/iconos/oro-puntaje.webp" alt="" class="stat-icon" />{gold}{#if showMax}/{WIN_CONDITIONS.GOLD}{/if}</span>
    <span><img src="/iconos/bala-puntaje.webp" alt="" class="stat-icon" />{bullets}{#if showMax}/{WIN_CONDITIONS.BULLETS}{/if}</span>
    <span class:has-bottle={hasBottle}><img src="/iconos/vaso-puntaje.webp" alt="" class="stat-icon" />{whiskyCount}{#if showMax}/{WIN_CONDITIONS.WHISKY}{/if}</span>
  </div>
</div>

<style>
  .stats-container { display: flex; align-items: center; gap: 1rem; width: 100%; justify-content: center; line-height: 1; }
  .player-name { color: #daa520; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; line-height: 1; }
  .stats-row { display: flex; gap: 0.8rem; font-size: 0.85rem; color: #f5deb3; align-items: center; line-height: 1; }
  .stat-icon { width: 18px; height: 18px; object-fit: contain; vertical-align: middle; margin-right: 2px; }
  .has-bottle { animation: bp 2s ease-in-out infinite; filter: drop-shadow(0 0 6px rgba(218,165,32,0.6)); }
  @keyframes bp { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
</style>
