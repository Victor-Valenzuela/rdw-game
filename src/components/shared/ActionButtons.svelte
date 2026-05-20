<script>
  let { canConfirm = false, isConfirmed = false, waitingText = 'Esperando al rival...', onconfirm, onhelp } = $props();
</script>

<div class="actions-row">
  {#if isConfirmed}
    <p class="waiting-msg">{waitingText}</p>
  {:else}
    <button onclick={onconfirm} class="btn-action" disabled={!canConfirm}>CONFIRMAR</button>
  {/if}
  <button onclick={onhelp} class="btn-help">?</button>
</div>

<style>
  .actions-row { display: flex; gap: 0.8rem; align-items: center; justify-content: center; }
  .btn-action { padding: 0.6rem 2rem; background: linear-gradient(135deg, #8b0000 0%, #dc143c 100%); color: #f5deb3; border: 2px solid #daa520; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; font-size: 0.85rem; }
  .btn-action:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.5); }
  .btn-action:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-help { width: 36px; height: 36px; border-radius: 50%; background: rgba(101,67,33,0.8); border: 2px solid #daa520; color: #daa520; font-size: 1rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .btn-help:hover { background: rgba(218,165,32,0.3); }
  .waiting-msg { color: #daa520; font-size: 0.9rem; opacity: 0.8; }
</style>
