<script>
  import { ACTION_NAMES, resolvePhase, getWinner } from '../lib/gameLogic.js';

  let { gameState, onupdate } = $props();

  let revealed = $state(false);

  let slots = $derived(gameState.selectingSlots);
  let placements = $derived(gameState.placements);

  function getActionImage(type) {
    if (type === 'loot') return '/jugador/loot4.webp';
    if (type === 'shoot') return '/jugador/shoot4.webp';
    if (type === 'whisky') return '/jugador/whisky.webp';
    return '';
  }

  function reveal() {
    revealed = true;
  }

  function resolve() {
    const newState = resolvePhase(gameState);
    revealed = false;
    onupdate(newState);
  }
</script>

<div class="revelacion-wrapper">
  <div class="revelacion">
    {#if !revealed}
      <h2>¡DUELO!</h2>
      <p class="subtitle">Ambos jugadores han elegido</p>
      <button onclick={reveal} class="btn-reveal">REVELAR</button>
    {:else}
      <h2>RESULTADO</h2>

      <div class="enfrentamientos">
        {#each slots as slotIdx, i}
          {@const placement = placements[slotIdx]}
          {#if placement}
            {@const winner = getWinner(placement.p1, placement.p2)}
            <div class="enfrentamiento">
              <span class="slot-label">Posición #{slotIdx + 1}</span>
              <div class="versus">
                <div class="action" class:winner={winner === 0} class:loser={winner === 1}>
                  <span class="player-label">J1</span>
                  <img src={getActionImage(placement.p1)} alt={ACTION_NAMES[placement.p1]} class="action-img" />
                </div>
                <span class="vs">VS</span>
                <div class="action" class:winner={winner === 1} class:loser={winner === 0}>
                  <span class="player-label">J2</span>
                  <img src={getActionImage(placement.p2)} alt={ACTION_NAMES[placement.p2]} class="action-img" />
                </div>
              </div>
              <span class="result-text">
                {#if winner === 'tie'}
                  ¡Empate!
                {:else}
                  J{winner + 1} gana con {ACTION_NAMES[winner === 0 ? placement.p1 : placement.p2]}
                {/if}
              </span>
            </div>
          {/if}
        {/each}
      </div>

      <button onclick={resolve} class="btn-resolve">CONTINUAR</button>
    {/if}
  </div>
</div>

<style>
  .revelacion-wrapper {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    padding: 1rem;
  }

  .revelacion {
    width: 100%;
    max-width: 500px;
    background: rgba(0, 0, 0, 0.7);
    padding: 1.5rem;
    border-radius: 15px;
    border: 2px solid #daa520;
    text-align: center;
    color: #f5deb3;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: #daa520;
    text-shadow: 2px 2px 0px #000;
  }

  .subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-bottom: 2rem;
  }

  .enfrentamientos {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .enfrentamiento {
    background: rgba(101, 67, 33, 0.4);
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #654321;
  }

  .slot-label {
    font-size: 0.75rem;
    color: #daa520;
    display: block;
    margin-bottom: 0.8rem;
  }

  .versus {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;
  }

  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    transition: all 0.3s ease;
    padding: 0.4rem;
    border-radius: 8px;
    flex: 1;
    max-width: 45%;
  }

  .action.winner {
    filter: drop-shadow(0 0 10px rgba(218, 165, 32, 0.9)) drop-shadow(0 0 20px rgba(218, 165, 32, 0.4));
    transform: scale(1.1);
  }

  .action.loser {
    opacity: 0.4;
    filter: grayscale(0.6);
    transform: scale(0.9);
  }

  .player-label {
    font-size: 0.65rem;
    color: #daa520;
    opacity: 0.7;
  }

  .action-img {
    width: 100%;
    max-width: 110px;
    height: auto;
    object-fit: contain;
    border-radius: 6px;
  }

  .name {
    font-size: 0.75rem;
    font-weight: bold;
  }

  .result-text {
    display: block;
    margin-top: 0.8rem;
    font-size: 0.8rem;
    color: #daa520;
    font-weight: bold;
  }

  .vs {
    font-size: 1.3rem;
    color: #ff6b6b;
    font-weight: bold;
  }

  .btn-reveal,
  .btn-resolve {
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
    color: #f5deb3;
    border: 2px solid #daa520;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    font-size: 1rem;
  }

  .btn-reveal:hover,
  .btn-resolve:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }
</style>
