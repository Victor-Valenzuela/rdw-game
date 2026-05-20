<script>
  let { ondismiss } = $props();
  let step = $state(0);
  let dontShowAgain = $state(false);

  const steps = [
    { title: 'El salón está abierto', text: 'Roba, Dispara, Whisky es un duelo del salvaje oeste con mecánica piedra-papel-tijera.' },
    { title: 'Las Acciones', text: 'Tienes 6 cartas: 2 Robar (Loot), 2 Disparar (Shoot), 2 Whisky. Cada ronda tiene 2 fases, y en cada fase juegas 2 cartas.' },
    { title: 'Quién le gana a quién', text: 'Robar (Loot) le gana a Whisky. Whisky le gana a Disparar (Shoot). Disparar le gana a Robar. Si lo olvidas, presiona el botón', hasHelpButton: true },
    { title: 'Ganar con Disparar', text: 'Si tu Disparar (Shoot) le gana al Robar del rival, acumulas 1 bala. Con 4 balas ganas la partida.' },
    { title: 'Ganar con Whisky', text: 'Si tu Whisky le gana al Disparar (Shoot) del rival, tomas la botella de whisky y 1 trago de esta. Necesitas 3 tragos para ganar. Pero si el rival gana con Whisky, te quita la botella y tu progreso se reinicia. El que tenga la botella verá su puntaje pulsando.' },
    { title: 'Ganar con Robar', text: 'Si tu Robar (Loot) le gana al Whisky del rival, robas la carta de la mesa. Según la carta: pepitas de oro suman puntos (9 para ganar), caja de balas te da +1 bala (4 para ganar), y vaso de whisky te da +1 trago (3 para ganar).' },
    { title: 'Las Cartas de la Mesa', text: 'Hay 4 cartas en el centro: pepitas de oro (de 3, 4, 5 o 6), cajas de balas, y vasos de whisky. Solo se roban con la acción Robar (Loot).' },
    { title: 'Empate', text: 'Si ambos jugadores eligen la misma acción, nadie gana y la carta de la mesa se descarta.' },
    { title: 'Fin del Mazo', text: 'Si no quedan cartas para rellenar la mesa, gana quien tenga la botella de whisky.' },
    { title: 'A jugar!', text: 'Elige tus cartas con cuidado. Suerte, vaquero.', large: true }
  ];

  function next() {
    if (step < steps.length - 1) step++;
    else close();
  }

  function prev() {
    if (step > 0) step--;
  }

  function close() {
    if (dontShowAgain) localStorage.setItem('rdw-skip-tutorial', 'true');
    ondismiss();
  }
</script>

<div class="tutorial-overlay">
  <div class="tutorial-box">
    <h2>{steps[step].title}</h2>
    <p class="tutorial-text" class:large-text={steps[step].large}>
      {steps[step].text}
      {#if steps[step].hasHelpButton}
        <span class="inline-help">?</span> durante la partida.
      {/if}
    </p>

    <div class="dots">
      {#each steps as _, i}
        <span class="dot" class:active={i === step}></span>
      {/each}
    </div>

    <div class="tutorial-buttons">
      {#if step > 0}
        <button onclick={prev} class="btn-nav">ATRAS</button>
      {/if}
      <button onclick={next} class="btn-nav btn-primary">
        {step < steps.length - 1 ? 'SIGUIENTE' : 'COMENZAR'}
      </button>
    </div>

    <label class="skip-label">
      <input type="checkbox" bind:checked={dontShowAgain} />
      No volver a mostrar
    </label>

    <button onclick={close} class="btn-skip">Saltar tutorial</button>
  </div>
</div>

<style>
  .tutorial-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; }
  .tutorial-box { width: 100%; max-width: 500px; background: url('/tutorial.webp') center/contain no-repeat; min-height: 620px; padding: 120px 6.5rem 3rem; text-align: center; color: #3d2817; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .tutorial-box h2 { font-family: 'Sancreek', cursive; font-size: 1.3rem; color: #1a0f08; margin-bottom: 0.8rem; text-transform: uppercase; font-weight: 400; letter-spacing: 3px; }
  .tutorial-text { font-family: 'Lora', serif; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.2rem; text-align: justify; color: #2a1810; font-weight: 600; min-height: 180px; -webkit-text-stroke: 0.2px #2a1810; }
  .large-text { font-size: 1rem; text-align: center; display: flex; align-items: center; justify-content: center; }
  .inline-help { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: rgba(101,67,33,0.8); border: 2px solid #daa520; color: #daa520; font-size: 0.75rem; font-weight: bold; vertical-align: middle; }
  .dots { display: flex; gap: 0.4rem; justify-content: center; margin-bottom: 1.5rem; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #c4a882; }
  .dot.active { background: #2a1810; }
  .tutorial-buttons { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; }
  .btn-nav { padding: 0.6rem 1.5rem; background: none; border: 2px solid #654321; border-radius: 8px; color: #2a1810; font-weight: bold; cursor: pointer; }
  .btn-primary { background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%); border-color: #8b0000; color: #f5deb3; }
  .skip-label { display: flex; align-items: center; gap: 0.5rem; justify-content: center; font-size: 0.75rem; color: #4a3520; margin-bottom: 0.8rem; cursor: pointer; font-weight: 600; }
  .skip-label input { cursor: pointer; }
  .btn-skip { background: none; border: none; color: #4a3520; font-size: 0.75rem; cursor: pointer; text-decoration: underline; font-weight: 600; }
  .btn-skip:hover { color: #2a1810; }
</style>
