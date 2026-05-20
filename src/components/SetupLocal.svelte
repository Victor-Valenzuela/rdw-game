<script>
  let { onstart, onback } = $props();

  let name1 = $state('');
  let name2 = $state('');

  function start() {
    const p1 = name1.trim() || 'Jugador 1';
    const p2 = name2.trim() || 'Jugador 2';
    onstart({ name1: p1, name2: p2 });
  }
</script>

<div class="setup-wrapper">
  <div class="setup">
    <h2>MODO LOCAL</h2>

    <div class="input-group">
      <label for="p1">Jugador 1</label>
      <input id="p1" type="text" bind:value={name1} placeholder="Nombre..." maxlength="12" />
    </div>

    <div class="input-group">
      <label for="p2">Jugador 2</label>
      <input id="p2" type="text" bind:value={name2} placeholder="Nombre..." maxlength="12" />
    </div>

    <button onclick={start} class="btn-start">COMENZAR DUELO</button>
    <button onclick={onback} class="btn-back">← VOLVER</button>
  </div>
</div>

<style>
  .setup-wrapper {
    width: 100%;
    height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('/fondo.webp') center top/cover no-repeat;
    padding: 1rem;
    position: relative;
  }

  .setup-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(20, 10, 5, 0.4);
  }

  .setup {
    width: 100%;
    max-width: 380px;
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
    position: relative;
    z-index: 1;
  }

  h2 {
    font-size: 1.5rem;
    color: #daa520;
    text-shadow: 2px 2px 0px #000;
  }

  .input-group {
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
    font-size: 0.9rem;
  }

  .btn-start:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
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
</style>
