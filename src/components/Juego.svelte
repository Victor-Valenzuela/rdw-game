<script>
  import PantallaTransicion from './PantallaTransicion.svelte';
  import Revelacion from './Revelacion.svelte';
  import OpponentZone from './shared/OpponentZone.svelte';
  import TableZone from './shared/TableZone.svelte';
  import StatsRow from './shared/StatsRow.svelte';
  import PlayerHand from './shared/PlayerHand.svelte';
  import ActionButtons from './shared/ActionButtons.svelte';
  import HelpModal from './shared/HelpModal.svelte';
  import FlyingCard from './shared/FlyingCard.svelte';
  import { WIN_CONDITIONS, placeActions } from '../lib/gameLogic.js';

  let { gameState, onreset, onupdate } = $props();

  let showTransition = $state(false);
  let transitionPlayer = $state(0);
  let selectedCards = $state([null, null]);
  let flyingCard = $state(null);
  let showHelp = $state(false);

  let currentPlayer = $derived(gameState.players[gameState.currentSelectingPlayer]);
  let opponent = $derived(gameState.players[1 - gameState.currentSelectingPlayer]);
  let availableCards = $derived(currentPlayer.actionCards.filter(c => !c.used));
  let slots = $derived(gameState.selectingSlots);
  let playerKey = $derived(gameState.currentSelectingPlayer === 0 ? 'p1' : 'p2');

  let gameContainer;

  function handleCardClick(card, event) {
    if (selectedCards[0]?.id === card.id || selectedCards[1]?.id === card.id) return;
    const targetSlot = !selectedCards[0] ? 0 : !selectedCards[1] ? 1 : -1;
    if (targetSlot === -1) return;
    const cardEl = event.currentTarget;
    const fromRect = cardEl.getBoundingClientRect();
    const slotIndex = slots[targetSlot];
    const targetEl = document.querySelector(`[data-slot="${slotIndex}"]`);
    const toRect = targetEl?.getBoundingClientRect();
    if (toRect) {
      flyingCard = { cardType: card.type, fromRect, toRect };
      setTimeout(() => {
        if (targetSlot === 0) selectedCards = [card, selectedCards[1]];
        else selectedCards = [selectedCards[0], card];
        flyingCard = null;
      }, 350);
    } else {
      if (targetSlot === 0) selectedCards = [card, selectedCards[1]];
      else selectedCards = [selectedCards[0], card];
    }
  }

  function removeFromSlot(card) {
    if (selectedCards[0]?.id === card.id) selectedCards = [null, selectedCards[1]];
    else selectedCards = [selectedCards[0], null];
  }

  function confirm() {
    if (!selectedCards[0] || !selectedCards[1]) return;
    const newState = placeActions(gameState, gameState.currentSelectingPlayer, selectedCards[0].id, selectedCards[1].id);
    selectedCards = [null, null];
    if (newState.gameState === 'selecting' && newState.currentSelectingPlayer !== gameState.currentSelectingPlayer) {
      transitionPlayer = newState.currentSelectingPlayer;
      showTransition = true;
    }
    onupdate(newState);
  }

  function dismissTransition() { showTransition = false; }
  function handleReveal(newState) { onupdate(newState); }
</script>

<div class="game-screen">
  {#if gameState.gameState === 'finished'}
    <div class="game-over">
      <h2>DUELO TERMINADO</h2>
      {#if gameState.winner !== null}
        <p class="win-text">{gameState.players[gameState.winner].name} GANÓ</p>
        <p class="sub-text">
          {#if gameState.victoryType === 'gold'}Juntó 9 pepitas de oro
          {:else if gameState.victoryType === 'bullets'}Acertó 4 disparos certeros
          {:else if gameState.victoryType === 'whisky'}Vació la botella
          {:else}Tenia la botella de whisky{/if}
        </p>
      {:else}
        <p class="win-text">EMPATE</p>
      {/if}
      <button onclick={onreset} class="btn-action">NUEVO DUELO</button>
    </div>

  {:else if showTransition}
    <PantallaTransicion playerName={gameState.players[transitionPlayer].name} ondismiss={dismissTransition} />

  {:else if gameState.gameState === 'revealing'}
    <Revelacion {gameState} onupdate={handleReveal} />

  {:else}
    <OpponentZone name={opponent.name} gold={opponent.gold} bullets={opponent.bullets} whiskyCount={opponent.whiskyCount} hasBottle={opponent.hasBottle} cardCount={opponent.actionCards.filter(c => !c.used).length} onleave={onreset} />

    <div bind:this={gameContainer} style="flex:1;display:flex;">
      <TableZone display={gameState.display} saloonDeckLength={gameState.saloonDeck.length} roundNumber={gameState.roundNumber} phase={gameState.phase} {slots} {selectedCards} placements={gameState.placements} {playerKey} />
    </div>

    <div class="player-zone">
      <StatsRow name={currentPlayer.name} gold={currentPlayer.gold} bullets={currentPlayer.bullets} whiskyCount={currentPlayer.whiskyCount} hasBottle={currentPlayer.hasBottle} showMax={true} />
      <PlayerHand cards={availableCards} {selectedCards} oncardclick={handleCardClick} onremove={removeFromSlot} />
      <ActionButtons canConfirm={!!selectedCards[0] && !!selectedCards[1]} onconfirm={confirm} onhelp={() => showHelp = true} />
    </div>
  {/if}

  <HelpModal show={showHelp} ondismiss={() => showHelp = false} />
  {#if flyingCard}
    <div class="flying-card" style="--from-x:{flyingCard.fromRect.left + flyingCard.fromRect.width/2}px;--from-y:{flyingCard.fromRect.top + flyingCard.fromRect.height/2}px;--to-x:{flyingCard.toRect.left + flyingCard.toRect.width/2}px;--to-y:{flyingCard.toRect.top + flyingCard.toRect.height/2}px;">
      <img src="/jugador/{flyingCard.cardType === 'loot' ? 'loot4' : flyingCard.cardType === 'shoot' ? 'shoot4' : 'whisky'}.webp" alt="" class="flying-img" />
    </div>
  {/if}
</div>

<style>
  .game-screen { width: 100%; height: 100dvh; display: flex; flex-direction: column; background: linear-gradient(135deg, #3d2817 0%, #2a1810 100%); position: relative; }
  .game-screen > :global(*) { position: relative; z-index: 1; }
  .player-zone { padding: 0.8rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
  .game-over { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #f5deb3; gap: 0.5rem; }
  .game-over h2 { font-size: 2.5rem; text-shadow: 2px 2px 0px #000; color: #daa520; }
  .win-text { font-size: 1.8rem; color: #ff6b6b; font-weight: bold; }
  .sub-text { font-size: 1.2rem; margin-bottom: 2rem; color: #f5deb3; }
  .btn-action { padding: 0.6rem 2rem; background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%); color: #f5deb3; border: 2px solid #daa520; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 0.85rem; }
  .btn-action:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.5); }
  .flying-card { position: fixed; z-index: 9999; width: 50px; height: 45px; border-radius: 8px; overflow: hidden; pointer-events: none; animation: flyToSlot 0.35s ease-out forwards; left: 0; top: 0; }
  .flying-img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; }
  @keyframes flyToSlot { 0% { transform: translate(calc(var(--from-x) - 25px), calc(var(--from-y) - 22px)) scale(1.2); opacity: 1; } 100% { transform: translate(calc(var(--to-x) - 25px), calc(var(--to-y) - 22px)) scale(1); opacity: 1; } }
</style>
