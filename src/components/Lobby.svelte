<script>
  import { createRoom, joinRoom } from '../lib/roomService.js';
  import QRCode from 'qrcode';

  let { onjoin, onback } = $props();

  let mode = $state('menu'); // menu | create | join
  let playerName = $state('');
  let roomCode = $state('');
  let error = $state('');
  let loading = $state(false);
  let qrDataUrl = $state('');
  let createdCode = $state('');

  async function handleCreate() {
    if (!playerName.trim()) {
      error = 'Ingresa tu nombre';
      return;
    }
    loading = true;
    error = '';
    try {
      const code = await createRoom(playerName.trim());
      createdCode = code;
      const url = `${window.location.origin}${window.location.pathname}?room=${code}`;
      qrDataUrl = await QRCode.toDataURL(url, { width: 200, margin: 1 });
      onjoin({ code, playerKey: 'p1', playerName: playerName.trim() });
    } catch (e) {
      error = e.message || 'Error al crear sala';
    }
    loading = false;
  }

  async function handleJoin() {
    if (!playerName.trim()) {
      error = 'Ingresa tu nombre';
      return;
    }
    if (!roomCode.trim()) {
      error = 'Ingresa el código de sala';
      return;
    }
    loading = true;
    error = '';
    try {
      await joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
      onjoin({ code: roomCode.trim().toUpperCase(), playerKey: 'p2', playerName: playerName.trim() });
    } catch (e) {
      error = e.message || 'Error al unirse';
    }
    loading = false;
  }

  // Check URL params for room code
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom) {
      roomCode = urlRoom;
      mode = 'join';
    }
  }
</script>

<div class="lobby">
  {#if mode === 'menu'}
    <h2>MODO ONLINE</h2>

    <div class="menu-buttons">
      <button onclick={() => mode = 'create'} class="btn-lobby">
        CREAR SALA
      </button>
      <button onclick={() => mode = 'join'} class="btn-lobby">
        UNIRSE
      </button>
    </div>

    <button onclick={onback} class="btn-back">← VOLVER</button>

  {:else if mode === 'create'}
    <h2>CREAR SALA</h2>

    {#if !createdCode}
      <div class="name-input">
        <label for="name">Tu nombre</label>
        <input id="name" type="text" bind:value={playerName} placeholder="Cowboy..." maxlength="12" />
      </div>
      <button onclick={handleCreate} class="btn-lobby" disabled={loading || !playerName.trim()}>
        {loading ? 'CREANDO...' : 'CREAR'}
      </button>
    {/if}

    <button onclick={() => { mode = 'menu'; createdCode = ''; }} class="btn-back">← VOLVER</button>

  {:else if mode === 'join'}
    <h2>UNIRSE A SALA</h2>

    <div class="name-input">
      <label for="name2">Tu nombre</label>
      <input id="name2" type="text" bind:value={playerName} placeholder="Cowboy..." maxlength="12" />
    </div>

    <div class="name-input">
      <label for="code">Código de sala</label>
      <input id="code" type="text" bind:value={roomCode} placeholder="ABCD" maxlength="5" class="code-input" />
    </div>

    <button onclick={handleJoin} class="btn-lobby" disabled={loading || !playerName.trim() || !roomCode.trim()}>
      {loading ? 'UNIÉNDOSE...' : 'UNIRSE'}
    </button>

    <button onclick={() => mode = 'menu'} class="btn-back">← VOLVER</button>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .lobby {
    width: 100%;
    max-width: 400px;
    background: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 15px;
    border: 2px solid #daa520;
    text-align: center;
    color: #f5deb3;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  h2 {
    font-size: 1.5rem;
    color: #daa520;
    text-shadow: 2px 2px 0px #000;
  }

  .name-input {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    text-align: left;
  }

  label {
    font-size: 0.75rem;
    color: #daa520;
    text-transform: uppercase;
  }

  input {
    width: 100%;
    padding: 0.7rem 1rem;
    background: rgba(101, 67, 33, 0.5);
    border: 2px solid #654321;
    border-radius: 8px;
    color: #f5deb3;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  input:focus {
    border-color: #daa520;
  }

  input::placeholder {
    color: rgba(245, 222, 179, 0.4);
  }

  .code-input {
    text-transform: uppercase;
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
  }

  .menu-buttons {
    display: flex;
    gap: 1rem;
    width: 100%;
  }

  .btn-lobby {
    flex: 1;
    padding: 0.8rem 1.5rem;
    background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
    color: #f5deb3;
    border: 2px solid #daa520;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    font-size: 0.85rem;
  }

  .btn-lobby:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
  }

  .btn-lobby:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn-back {
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid #654321;
    border-radius: 6px;
    color: #daa520;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }

  .btn-back:hover {
    border-color: #daa520;
  }

  .error {
    color: #ff6b6b;
    font-size: 0.85rem;
  }
</style>
