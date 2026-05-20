<script>
  let { onlocal, ononline } = $props();
</script>

<div class="container">
  <div class="content">
    <h1>ROBA, DISPARA, WHISKY</h1>

    <div class="icons">
      <img src="/iconos/oro-puntaje.webp" alt="Robar" class="start-icon" />
      <img src="/iconos/bala-puntaje.webp" alt="Disparar" class="start-icon" />
      <img src="/iconos/vaso-puntaje.webp" alt="Whisky" class="start-icon" />
    </div>

    <div class="buttons">
      <button onclick={onlocal} class="btn-start">LOCAL</button>
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
    background: url('/fondo.webp') center/cover no-repeat;
    position: relative;
  }

  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(20, 10, 5, 0.4);
  }

  .content {
    text-align: center;
    color: #f5deb3;
    position: relative;
    z-index: 1;
  }

  h1 {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 900;
    margin-bottom: 0.5rem;
    text-shadow: 3px 3px 0px #000, 6px 6px 0px rgba(0, 0, 0, 0.5);
    letter-spacing: 3px;
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.8;
    font-style: italic;
  }

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
  }

  .buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
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
