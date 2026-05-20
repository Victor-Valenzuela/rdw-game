<script>
  import PantallaInicio from './PantallaInicio.svelte';
  import SetupLocal from './SetupLocal.svelte';
  import Juego from './Juego.svelte';
  import JuegoOnline from './JuegoOnline.svelte';
  import Lobby from './Lobby.svelte';
  import EsperaSala from './EsperaSala.svelte';
  import Tutorial from './Tutorial.svelte';
  import { initializeGame } from '../lib/gameLogic.js';
  import { listenToRoom } from '../lib/roomService.js';

  let screen = $state('inicio');
  let gameState = $state(null);
  let showTutorial = $state(false);

  // Online state
  let roomCode = $state('');
  let playerKey = $state('');
  let playerName = $state('');
  let roomData = $state(null);
  let unsubscribe = $state(null);

  // Restaurar sesion online al cargar
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('rdw-session');
    if (saved) {
      const session = JSON.parse(saved);
      roomCode = session.roomCode;
      playerKey = session.playerKey;
      playerName = session.playerName;
      unsubscribe = listenToRoom(session.roomCode, (data) => {
        if (!data) { clearSession(); return; }
        roomData = data;
        if (data.status === 'playing' || data.status === 'finished') screen = 'online';
        else if (data.status === 'ready') screen = 'waiting';
        else if (data.status === 'waiting' && playerKey === 'p1') screen = 'waiting';
      });
    } else {
      const savedLocal = localStorage.getItem('rdw-local-game');
      if (savedLocal) {
        gameState = JSON.parse(savedLocal);
        screen = 'local';
      }
    }
  }

  function saveSession() {
    localStorage.setItem('rdw-session', JSON.stringify({ roomCode, playerKey, playerName }));
  }

  function clearSession() {
    localStorage.removeItem('rdw-session');
    if (unsubscribe) unsubscribe();
    roomCode = ''; playerKey = ''; roomData = null;
    screen = 'inicio';
  }

  function startLocal() {
    screen = 'setupLocal';
  }

  function handleSetupLocal(data) {
    gameState = initializeGame();
    gameState.players[0].name = data.name1;
    gameState.players[1].name = data.name2;
    if (typeof window !== 'undefined' && !localStorage.getItem('rdw-skip-tutorial')) {
      showTutorial = true;
    }
    saveLocalGame();
    screen = 'local';
  }

  function updateLocalGame(s) {
    gameState = s;
    saveLocalGame();
  }

  function saveLocalGame() {
    if (gameState) localStorage.setItem('rdw-local-game', JSON.stringify(gameState));
  }

  function clearLocalGame() {
    localStorage.removeItem('rdw-local-game');
  }

  function startOnline() {
    screen = 'lobby';
  }

  function handleJoinRoom(data) {
    roomCode = data.code;
    playerKey = data.playerKey;
    playerName = data.playerName;
    saveSession();

    unsubscribe = listenToRoom(data.code, (roomInfo) => {
      if (!roomInfo) { clearSession(); return; }
      roomData = roomInfo;
      if (roomInfo.status === 'playing' || roomInfo.status === 'finished') screen = 'online';
      else if (roomInfo.status === 'ready') screen = 'waiting';
      else if (roomInfo.status === 'waiting' && playerKey === 'p1') screen = 'waiting';
    });

  }

  function handleLeaveRoom() {
    clearSession();
  }

  function resetGame() {
    clearSession();
    clearLocalGame();
    gameState = null;
  }
</script>

{#if screen === 'inicio'}
  <PantallaInicio onlocal={startLocal} ononline={startOnline} />
{:else if screen === 'setupLocal'}
  <SetupLocal onstart={handleSetupLocal} onback={() => screen = 'inicio'} />
{:else if screen === 'local'}
  {#if showTutorial}
    <Tutorial ondismiss={() => showTutorial = false} />
  {/if}
  <Juego {gameState} onreset={resetGame} onupdate={updateLocalGame} />
{:else if screen === 'lobby'}
  <div class="lobby-wrapper">
    <Lobby onjoin={handleJoinRoom} onback={() => screen = 'inicio'} />
  </div>
{:else if screen === 'waiting'}
  <div class="lobby-wrapper">
    <EsperaSala code={roomCode} roomData={roomData} {playerKey} onleave={handleLeaveRoom} />
  </div>
{:else if screen === 'online'}
  <JuegoOnline {roomCode} {playerKey} {playerName} {roomData} onleave={handleLeaveRoom} />
{/if}

<style>
  .lobby-wrapper {
    width: 100%;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/fondo.jpg') center top/cover no-repeat;
    padding: 1rem;
    position: relative;
  }

  .lobby-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(20, 10, 5, 0.4);
  }

  .lobby-wrapper > :global(*) {
    position: relative;
    z-index: 1;
  }
</style>
