<script>
  let { playerName, ondismiss } = $props();
</script>

<div class="transition-screen">
  <div class="content">
    <h2>Pasa el dispositivo a</h2>
    <p class="player-name">{playerName}</p>
    <button onclick={ondismiss} class="btn-ready">ESTOY LISTO</button>
  </div>
</div>

<style>
  .transition-screen {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.95);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .content {
    text-align: center;
    color: #f5deb3;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .player-name {
    font-size: 3rem;
    font-weight: 900;
    color: #daa520;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 0px #000;
  }

  .btn-ready {
    padding: 1rem 2.5rem;
    background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%);
    color: #f5deb3;
    border: 3px solid #daa520;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
  }

  .btn-ready:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.7);
  }
</style>
