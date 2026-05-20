<script>
  let { show = false, ondismiss } = $props();
</script>

{#if show}
  <div class="help-modal" onclick={ondismiss}>
    <img src="/ayuda2.png" alt="Ayuda" class="help-img" />
  </div>
{/if}

<style>
  .help-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; cursor: pointer; }
  .help-img { max-width: 300px; max-height: 80vh; object-fit: contain; }
</style>
