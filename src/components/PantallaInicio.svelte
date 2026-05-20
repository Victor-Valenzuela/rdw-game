<script>
  let { onlocal, ononline } = $props();
</script>

<div class="container">
  <video class="bg-video" autoplay muted loop playsinline>
    <source src="/fondo-animado.mp4" type="video/mp4" />
  </video>

  <!-- Partículas de polvo -->
  <div class="dust-layer">
    <div class="dust d1"></div>
    <div class="dust d2"></div>
    <div class="dust d3"></div>
    <div class="dust d4"></div>
    <div class="dust d5"></div>
    <div class="dust d6"></div>
    <div class="dust d7"></div>
    <div class="dust d8"></div>
    <div class="dust d9"></div>
    <div class="dust d10"></div>
  </div>

  <div class="content">
    <div class="title-row">
      <span class="word w1">ROBA</span>
      <span class="separator w1">-</span>
      <span class="word w2">DISPARA</span>
      <span class="separator w2">-</span>
      <span class="word w3">WHISKY</span>
    </div>

    <div class="icons">
      <img src="/iconos/oro-puntaje.webp" alt="Robar" class="start-icon i1" />
      <img src="/iconos/bala-puntaje.webp" alt="Disparar" class="start-icon i2" />
      <img src="/iconos/vaso-puntaje.webp" alt="Whisky" class="start-icon i3" />
    </div>

    <div class="buttons">
      <button onclick={onlocal} class="btn-start btn-local">LOCAL</button>
      <button onclick={ononline} class="btn-start btn-online">ONLINE</button>
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2a1810;
    position: relative;
    overflow: hidden;
  }

  .bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(20, 10, 5, 0.4);
    z-index: 1;
  }

  /* Partículas de polvo */
  .dust-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .dust {
    position: absolute;
    width: 200px;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), rgba(245, 222, 179, 0.2), transparent);
    border-radius: 50%;
    filter: blur(1px);
  }

  .d1 { top: 62%; animation: drift 10s linear infinite; width: 250px; }
  .d2 { top: 68%; animation: drift 16s linear infinite; animation-delay: -3s; width: 350px; }
  .d3 { top: 74%; animation: drift 13s linear infinite; animation-delay: -7s; width: 180px; }
  .d4 { top: 80%; animation: drift 18s linear infinite; animation-delay: -1s; width: 300px; }
  .d5 { top: 85%; animation: drift 11s linear infinite; animation-delay: -9s; width: 220px; }
  .d6 { top: 65%; animation: drift 14s linear infinite; animation-delay: -5s; width: 280px; }
  .d7 { top: 90%; animation: drift 17s linear infinite; animation-delay: -12s; width: 200px; }
  .d8 { top: 95%; animation: drift 12s linear infinite; animation-delay: -6s; width: 320px; }
  .d9 { top: 72%; animation: drift 19s linear infinite; animation-delay: -14s; width: 160px; }
  .d10 { top: 88%; animation: drift 15s linear infinite; animation-delay: -8s; width: 270px; }

  @keyframes drift {
    0% { left: -300px; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { left: 110%; opacity: 0; }
  }



  /* Contenido */
  .content {
    text-align: center;
    color: #f5deb3;
    position: relative;
    z-index: 3;
    margin-top: -10vh;
  }

  /* Título con efecto western metálico */
  .title-row {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .word {
    font-family: 'Rye', cursive;
    font-size: clamp(2.2rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    background: linear-gradient(180deg, #f4e4a0 0%, #daa520 30%, #8b6914 60%, #daa520 80%, #f4e4a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(2px 3px 0px #000) drop-shadow(4px 5px 0px rgba(0,0,0,0.4));
    animation: revealWord 0.6s ease-out forwards, shimmer 4s ease-in-out infinite;
    opacity: 0;
  }

  .w1 { animation-delay: 0.3s, 3s; }
  .w2 { animation-delay: 0.7s, 3.4s; }
  .w3 { animation-delay: 1.1s, 3.8s; }

  .separator {
    font-family: 'Rye', cursive;
    font-size: clamp(2.2rem, 6vw, 4.5rem);
    background: linear-gradient(180deg, #f4e4a0 0%, #daa520 30%, #8b6914 60%, #daa520 80%, #f4e4a0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(2px 3px 0px #000) drop-shadow(4px 5px 0px rgba(0,0,0,0.4));
    opacity: 0;
    animation: revealWord 0.6s ease-out forwards;
  }

  .separator.w1 { animation-delay: 0.5s; }
  .separator.w2 { animation-delay: 0.9s; }

  @keyframes revealWord {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }

  @keyframes shimmer {
    0%, 100% { filter: drop-shadow(2px 3px 0px #000) drop-shadow(4px 5px 0px rgba(0,0,0,0.4)) brightness(1); }
    50% { filter: drop-shadow(2px 3px 0px #000) drop-shadow(4px 5px 0px rgba(0,0,0,0.4)) brightness(1.3); }
  }

  /* Iconos */
  .icons {
    margin-bottom: 3rem;
    display: flex;
    gap: 2rem;
    justify-content: center;
  }

  .start-icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
    opacity: 0;
    animation: popIn 0.4s ease-out forwards, iconPulse 2.5s ease-in-out infinite;
  }

  .i1 { animation-delay: 1.5s, 2.5s; }
  .i2 { animation-delay: 1.7s, 2.8s; }
  .i3 { animation-delay: 1.9s, 3.1s; }

  @keyframes popIn {
    0% { opacity: 0; transform: scale(0.3); }
    70% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes iconPulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 8px rgba(218,165,32,0.5)); }
  }

  /* Botones */
  .buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.5s ease-out 2.2s forwards;
  }

  @keyframes fadeUp {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .btn-start {
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
    letter-spacing: 2px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }

  .btn-online {
    background: linear-gradient(135deg, #1a5276 0%, #2980b9 100%);
  }

  .btn-start:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.7);
  }

  .btn-start:active {
    transform: translateY(-1px);
  }
</style>
