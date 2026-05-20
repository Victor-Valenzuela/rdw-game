<script>
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { deleteRoom, startOnlineGame } from '../lib/roomService.js';

  let { code, roomData, playerKey, onleave } = $props();

  let qrDataUrl = $state('');

  let opponentName = $derived(roomData?.players?.p2?.name);
  let isReady = $derived(roomData?.status === 'ready');
  let isHost = $derived(playerKey === 'p1');

  onMount(async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${code}`;
    qrDataUrl = await QRCode.toDataURL(url, { width: 200, margin: 1, color: { dark: '#f5deb3', light: '#00000000' } });
  });

  async function handleStart() {
    await startOnlineGame(code);
  }

  async function handleLeave() {
    await deleteRoom(code);
    onleave();
  }
</script>

<div class="espera">
  <h2>SALA CREADA</h2>

  <div class="code-display">
    <span class="code-label">Código:</span>
    <span class="code-value">{code}</span>
  </div>

  {#if qrDataUrl}
    <div class="qr-container">
      <img src={qrDataUrl} alt="QR para unirse" class="qr-img" />
    </div>
  {/if}

  {#if isReady}
    {#if isHost}
      <p class="joined-text">🤠 <strong>{opponentName}</strong> se unió</p>
      <button onclick={handleStart} class="btn-start">COMENZAR PARTIDA</button>
    {:else}
      <p class="waiting-text">Esperando a que el host inicie...</p>
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    {/if}
  {:else}
    <p class="waiting-text">Esperando al otro jugador...</p>
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  {/if}

  <button onclick={handleLeave} class="btn-leave">SALIR DE LA SALA</button>
</div>

<style>
  .espera {
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

  .code-display {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .code-label {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .code-value {
    font-size: 2.5rem;
    font-weight: 900;
    color: #daa520;
    letter-spacing: 0.4rem;
    text-shadow: 2px 2px 0px #000;
  }

  .qr-container {
    background: rgba(255, 255, 255, 0.05);
    padding: 1rem;
    border-radius: 10px;
    border: 1px solid #654321;
  }

  .qr-img {
    width: 160px;
    height: 160px;
  }

  .waiting-text {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .joined-text {
    font-size: 1.1rem;
    color: #daa520;
  }

  .loading-dots {
    display: flex;
    gap: 0.4rem;
  }

  .loading-dots span {
    width: 8px;
    height: 8px;
    background: #daa520;
    border-radius: 50%;
    animation: dotPulse 1.4s ease-in-out infinite;
  }

  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotPulse {
    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1.2); }
  }

  .btn-start {
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

  .btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }

  .btn-leave {
    padding: 0.6rem 1.5rem;
    background: none;
    border: 2px solid #ff6b6b;
    border-radius: 8px;
    color: #ff6b6b;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
  }

  .btn-leave:hover {
    background: rgba(255, 107, 107, 0.15);
  }
</style>
