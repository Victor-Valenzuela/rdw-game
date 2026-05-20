<script>
  import OpponentZone from './shared/OpponentZone.svelte';
  import TableZone from './shared/TableZone.svelte';
  import StatsRow from './shared/StatsRow.svelte';
  import PlayerHand from './shared/PlayerHand.svelte';
  import ActionButtons from './shared/ActionButtons.svelte';
  import HelpModal from './shared/HelpModal.svelte';
  import FlyingCard from './shared/FlyingCard.svelte';
  import { ACTION_NAMES, WIN_CONDITIONS, getWinner, resolvePhase } from '../lib/gameLogic.js';
  import { updateGameState, restartGame, deleteRoom } from '../lib/roomService.js';

  let { roomCode, playerKey, playerName, roomData, onleave } = $props();

  let selectedCards = $state([null, null]);
  let showHelp = $state(false);
  let countdown = $state(0);
  let revealed = $state(false);
  let countdownInterval = $state(null);
  let flyingCard = $state(null);
  let gameContainer;

  let game = $derived(roomData?.game);
  let myData = $derived(game?.[playerKey]);
  let opponentKey = $derived(playerKey === 'p1' ? 'p2' : 'p1');
  let opponentData = $derived(game?.[opponentKey]);
  let myName = $derived(roomData?.players?.[playerKey]?.name || playerName);
  let opponentName = $derived(roomData?.players?.[opponentKey]?.name || 'Rival');
  let slots = $derived(game?.selectingSlots || [0, 1]);
  let availableCards = $derived(myData?.actionCards?.filter(c => !c.used) || []);
  let bothConfirmed = $derived(myData?.confirmed && opponentData?.confirmed);
  let bothReadyToContinue = $derived(game?.p1ReadyToContinue && game?.p2ReadyToContinue);
  let myReadyToContinue = $derived(playerKey === 'p1' ? game?.p1ReadyToContinue : game?.p2ReadyToContinue);
  let isGameOver = $derived(game && game.winner != null);
  let revealPlacements = $derived(game ? buildPlacements() : [null, null, null, null]);
  let myWantsRematch = $derived(playerKey === 'p1' ? game?.p1WantsRematch : game?.p2WantsRematch);
  let opponentWantsRematch = $derived(playerKey === 'p1' ? game?.p2WantsRematch : game?.p1WantsRematch);
  let iWon = $derived(isGameOver && ((playerKey === 'p1' && game.winner === 0) || (playerKey === 'p2' && game.winner === 1)));
  let winnerName = $derived(game?.winner === 0 ? roomData?.players?.p1?.name : roomData?.players?.p2?.name);

  $effect(() => {
    if (bothConfirmed && !revealed && countdown === 0 && !countdownInterval) {
      countdown = 3;
      countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) { clearInterval(countdownInterval); countdownInterval = null; revealed = true; }
      }, 1000);
    }
    if (!bothConfirmed && revealed) { revealed = false; countdown = 0; }
  });

  $effect(() => { if (bothReadyToContinue && revealed && playerKey === 'p1') doResolve(); });

  $effect(() => {
    if (game?.p1WantsRematch && game?.p2WantsRematch && playerKey === 'p1') {
      restartGame(roomCode).then(() => { revealed = false; countdown = 0; });
    }
  });

  function buildPlacements() {
    if (!game) return [null, null, null, null];
    const s = game.selectingSlots;
    const p = [null, null, null, null];
    if (game.p1.selectedActions?.[0] && game.p2.selectedActions?.[0])
      p[s[0]] = { p1: game.p1.selectedActions[0], p2: game.p2.selectedActions[0] };
    if (game.p1.selectedActions?.[1] && game.p2.selectedActions?.[1])
      p[s[1]] = { p1: game.p1.selectedActions[1], p2: game.p2.selectedActions[1] };
    return p;
  }

  function getActionImg(type) {
    if (type === 'loot') return '/jugador/loot4.webp';
    if (type === 'shoot') return '/jugador/shoot4.webp';
    return '/jugador/whisky.webp';
  }

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

  async function confirm() {
    if (!selectedCards[0] || !selectedCards[1]) return;
    const updatedCards = myData.actionCards.map(c => {
      if (c.id === selectedCards[0].id || c.id === selectedCards[1].id) return { ...c, used: true };
      return c;
    });
    await updateGameState(roomCode, {
      [`game.${playerKey}.selectedActions`]: [selectedCards[0].type, selectedCards[1].type],
      [`game.${playerKey}.confirmed`]: true,
      [`game.${playerKey}.actionCards`]: updatedCards
    });
    selectedCards = [null, null];
  }

  async function handleContinue() {
    const key = playerKey === 'p1' ? 'game.p1ReadyToContinue' : 'game.p2ReadyToContinue';
    await updateGameState(roomCode, { [key]: true });
  }

  async function doResolve() {
    const placements = buildPlacements();
    const gameState = {
      players: [
        { ...game.p1, id: 0, name: roomData.players.p1.name, actionCards: game.p1.actionCards },
        { ...game.p2, id: 1, name: roomData.players.p2.name, actionCards: game.p2.actionCards }
      ],
      saloonDeck: [...game.saloonDeck], display: [...game.display],
      discardPile: [...(game.discardPile || [])], phase: game.phase, placements,
      gameState: 'revealing', currentSelectingPlayer: 0,
      selectingSlots: game.selectingSlots, winner: game.winner,
      victoryType: game.victoryType, roundNumber: game.roundNumber, lastResolution: game.lastResolution
    };
    const resolved = resolvePhase(gameState);
    const update = {
      'game.display': resolved.display, 'game.saloonDeck': resolved.saloonDeck,
      'game.discardPile': resolved.discardPile, 'game.phase': resolved.phase,
      'game.selectingSlots': resolved.selectingSlots, 'game.placements': resolved.placements,
      'game.roundNumber': resolved.roundNumber, 'game.winner': resolved.winner,
      'game.victoryType': resolved.victoryType, 'game.lastResolution': resolved.lastResolution,
      'game.p1.gold': resolved.players[0].gold, 'game.p1.bullets': resolved.players[0].bullets,
      'game.p1.whiskyCount': resolved.players[0].whiskyCount, 'game.p1.hasBottle': resolved.players[0].hasBottle,
      'game.p1.bottleState': resolved.players[0].bottleState, 'game.p1.actionCards': resolved.players[0].actionCards,
      'game.p1.selectedActions': [null, null], 'game.p1.confirmed': false,
      'game.p2.gold': resolved.players[1].gold, 'game.p2.bullets': resolved.players[1].bullets,
      'game.p2.whiskyCount': resolved.players[1].whiskyCount, 'game.p2.hasBottle': resolved.players[1].hasBottle,
      'game.p2.bottleState': resolved.players[1].bottleState, 'game.p2.actionCards': resolved.players[1].actionCards,
      'game.p2.selectedActions': [null, null], 'game.p2.confirmed': false,
      'game.p1ReadyToContinue': false, 'game.p2ReadyToContinue': false
    };
    if (resolved.gameState === 'finished') update['status'] = 'finished';
    await updateGameState(roomCode, update);
    revealed = false; countdown = 0;
  }

  async function handlePlayAgain() {
    const key = playerKey === 'p1' ? 'game.p1WantsRematch' : 'game.p2WantsRematch';
    await updateGameState(roomCode, { [key]: true });
  }

  let showLeaveConfirm = $state(false);

  function askLeave() { showLeaveConfirm = true; }
  function cancelLeave() { showLeaveConfirm = false; }
  async function handleLeave() { showLeaveConfirm = false; await deleteRoom(roomCode); onleave(); }
</script>

{#if !game}
  <div class="game-screen"><div class="center-msg"><p>Cargando...</p></div></div>
{:else}
<div class="game-screen">
  {#if isGameOver}
    <div class="game-over">
      <h2>DUELO TERMINADO</h2>
      {#if game.victoryType === 'bottle_tiebreak'}
        <p class="sub-text">No quedan cartas en el mazo</p>
        {#if iWon}<p class="win-text">GANASTE</p><p class="sub-text">Tenias la botella de whisky</p>
        {:else}<p class="win-text">{winnerName} GANÓ</p><p class="sub-text">Tenia la botella de whisky</p>{/if}
      {:else}
        {#if iWon}<p class="win-text">GANASTE</p>
          <p class="sub-text">{#if game.victoryType === 'gold'}Juntaste 9 pepitas de oro{:else if game.victoryType === 'bullets'}Acertaste 4 disparos certeros{:else}Vaciaste la botella{/if}</p>
        {:else}<p class="win-text">{winnerName} GANÓ</p>
          <p class="sub-text">{#if game.victoryType === 'gold'}Juntó 9 pepitas de oro{:else if game.victoryType === 'bullets'}Acertó 4 disparos certeros{:else}Vació la botella{/if}</p>
        {/if}
      {/if}
      <div class="end-buttons">
        {#if myWantsRematch}<p class="wait-text">Esperando al otro jugador...</p>
        {:else}
          {#if opponentWantsRematch}<p class="rematch-text">{opponentName} quiere jugar de nuevo</p>{/if}
          <button onclick={handlePlayAgain} class="btn-action">JUGAR DE NUEVO</button>
        {/if}
        <button onclick={askLeave} class="btn-leave">SALIR</button>
      </div>
    </div>

  {:else if bothConfirmed && !revealed}
    <div class="center-msg"><h2>DUELO</h2><div class="countdown-number">{countdown}</div></div>

  {:else if revealed}
    <div class="reveal-wrapper">
      <div class="revelacion-box">
        <h2>RESULTADO</h2>
        <div class="enfrentamientos">
          {#each slots as slotIdx}
            {@const placement = revealPlacements[slotIdx]}
            {#if placement}
              {@const winner = getWinner(placement.p1, placement.p2)}
              <div class="enfrentamiento">
                <span class="slot-label">Posicion #{slotIdx + 1}</span>
                <div class="versus">
                  <div class="action" class:winner-card={winner === 0} class:loser-card={winner === 1}>
                    <span class="plabel">{roomData.players.p1.name}</span>
                    <img src={getActionImg(placement.p1)} alt="" class="action-img" />
                  </div>
                  <span class="vs">VS</span>
                  <div class="action" class:winner-card={winner === 1} class:loser-card={winner === 0}>
                    <span class="plabel">{roomData.players.p2.name}</span>
                    <img src={getActionImg(placement.p2)} alt="" class="action-img" />
                  </div>
                </div>
                <span class="result-text">
                  {#if winner === 'tie'}Empate
                  {:else}
                    {@const winAction = winner === 0 ? placement.p1 : placement.p2}
                    {winner === 0 ? roomData.players.p1.name : roomData.players.p2.name} gana con {ACTION_NAMES[winAction]}
                    {#if winAction === 'shoot'}<span class="reward">(+1 <img src="/iconos/bala-puntaje.webp" alt="" class="ri" />)</span>
                    {:else if winAction === 'whisky'}<span class="reward">(+1 <img src="/iconos/vaso-puntaje.webp" alt="" class="ri" />)</span>
                    {:else if winAction === 'loot'}
                      {@const sc = game.display[slotIdx]}
                      {#if sc?.type === 'gold'}<span class="reward">(+{sc.value} <img src="/iconos/oro-puntaje.webp" alt="" class="ri" />)</span>
                      {:else if sc?.type === 'extra_whisky'}<span class="reward">(+1 <img src="/iconos/vaso-puntaje.webp" alt="" class="ri" />)</span>
                      {:else if sc?.type === 'extra_shot'}<span class="reward">(+1 <img src="/iconos/bala-puntaje.webp" alt="" class="ri" />)</span>
                      {/if}
                    {/if}
                  {/if}
                </span>
              </div>
            {/if}
          {/each}
        </div>
        {#if myReadyToContinue}<p class="wait-text">Esperando al otro jugador...</p>
        {:else}<button onclick={handleContinue} class="btn-action">CONTINUAR</button>{/if}
      </div>
    </div>

  {:else}
    <OpponentZone name={opponentName} gold={opponentData?.gold || 0} bullets={opponentData?.bullets || 0} whiskyCount={opponentData?.whiskyCount || 0} hasBottle={opponentData?.hasBottle} cardCount={opponentData?.actionCards?.filter(c => !c.used).length || 0} onleave={askLeave} />

    <div bind:this={gameContainer} style="flex:1;display:flex;">
      <TableZone display={game.display} saloonDeckLength={game.saloonDeck?.length || 0} roundNumber={game.roundNumber} phase={game.phase} {slots} {selectedCards} placements={game.placements} {playerKey} isConfirmed={myData?.confirmed} selectedActions={myData?.selectedActions} />
    </div>

    <div class="player-zone">
      <StatsRow name={myName} gold={myData?.gold || 0} bullets={myData?.bullets || 0} whiskyCount={myData?.whiskyCount || 0} hasBottle={myData?.hasBottle} showMax={true} />
      <PlayerHand cards={availableCards} {selectedCards} disabled={myData?.confirmed} oncardclick={handleCardClick} onremove={removeFromSlot} />
      <ActionButtons canConfirm={!!selectedCards[0] && !!selectedCards[1]} isConfirmed={myData?.confirmed} onconfirm={confirm} onhelp={() => showHelp = true} />
    </div>
  {/if}

  <HelpModal show={showHelp} ondismiss={() => showHelp = false} />
  {#if showLeaveConfirm}
    <div class="confirm-modal">
      <div class="confirm-box">
        <p>Salir de la sala?</p>
        <p class="confirm-sub">La sala se eliminará</p>
        <div class="confirm-buttons">
          <button onclick={handleLeave} class="btn-action">SALIR</button>
          <button onclick={cancelLeave} class="btn-cancel">CANCELAR</button>
        </div>
      </div>
    </div>
  {/if}
  <FlyingCard {flyingCard} />
</div>
{/if}

<style>
  .game-screen { width: 100%; height: 100dvh; display: flex; flex-direction: column; background: linear-gradient(135deg, #3d2817 0%, #2a1810 100%); overflow: hidden; }
  .player-zone { padding: 0.8rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
  .center-msg { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #f5deb3; }
  .center-msg h2 { font-size: 2.5rem; color: #daa520; text-shadow: 2px 2px 0px #000; margin-bottom: 1rem; }
  .countdown-number { font-size: 6rem; font-weight: 900; color: #ff6b6b; text-shadow: 3px 3px 0px #000; animation: cp 1s ease-in-out infinite; }
  @keyframes cp { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
  .game-over { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #f5deb3; gap: 0.5rem; }
  .game-over h2 { font-size: 2.5rem; color: #daa520; }
  .win-text { font-size: 1.8rem; color: #ff6b6b; font-weight: bold; }
  .sub-text { font-size: 1.2rem; margin-bottom: 2rem; }
  .end-buttons { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  .btn-action { padding: 0.6rem 2rem; background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%); color: #f5deb3; border: 2px solid #daa520; border-radius: 8px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 0.85rem; }
  .btn-action:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-leave { padding: 0.6rem 1.5rem; background: none; border: 2px solid #ff6b6b; border-radius: 8px; color: #ff6b6b; font-weight: bold; cursor: pointer; }
  .wait-text { color: #daa520; font-size: 0.9rem; }
  .rematch-text { color: #daa520; font-size: 0.85rem; }
  .reveal-wrapper { flex: 1; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
  .revelacion-box { width: 100%; max-width: 500px; background: rgba(0,0,0,0.7); padding: 1.5rem; border-radius: 15px; border: 2px solid #daa520; text-align: center; color: #f5deb3; }
  .revelacion-box h2 { font-size: 2rem; margin-bottom: 1rem; color: #daa520; }
  .enfrentamientos { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
  .enfrentamiento { background: rgba(101,67,33,0.4); padding: 1rem; border-radius: 10px; border: 1px solid #654321; }
  .slot-label { font-size: 0.75rem; color: #daa520; display: block; margin-bottom: 0.8rem; }
  .versus { display: flex; align-items: center; justify-content: space-evenly; gap: 0.5rem; }
  .action { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; padding: 0.4rem; border-radius: 8px; flex: 1; max-width: 45%; transition: all 0.3s; }
  .winner-card { filter: drop-shadow(0 0 10px rgba(218,165,32,0.9)); transform: scale(1.1); }
  .loser-card { opacity: 0.4; filter: grayscale(0.6); transform: scale(0.9); }
  .plabel { font-size: 0.65rem; color: #daa520; opacity: 0.7; }
  .action-img { width: 100%; max-width: 110px; height: auto; object-fit: contain; border-radius: 6px; }
  .vs { font-size: 1.3rem; color: #ff6b6b; font-weight: bold; }
  .result-text { display: block; margin-top: 0.8rem; font-size: 0.8rem; color: #daa520; font-weight: bold; }
  .reward { display: inline-flex; align-items: center; gap: 2px; }
  .ri { width: 14px; height: 14px; object-fit: contain; vertical-align: middle; }
  .confirm-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .confirm-box { background: rgba(30,15,5,0.95); border: 2px solid #daa520; border-radius: 15px; padding: 2rem; text-align: center; color: #f5deb3; }
  .confirm-box p { font-size: 1.2rem; font-weight: bold; }
  .confirm-sub { font-size: 0.85rem; opacity: 0.7; margin-top: 0.5rem; font-weight: normal; }
  .confirm-buttons { display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: center; }
  .btn-cancel { padding: 0.6rem 1.5rem; background: none; border: 2px solid #654321; border-radius: 8px; color: #f5deb3; font-weight: bold; cursor: pointer; }
</style>
