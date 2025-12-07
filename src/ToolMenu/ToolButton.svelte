<script lang="ts">
  export let icon: string;
  export let title: string = "";
  export let onClick: () => void = () => {};
  export let wide: boolean = false;
  export let className: string = "";
</script>

<button
  on:click={onClick}
  class={`tool-btn ${wide ? "tool-wide" : "tool-square"} ${className}`}
>
  {#if icon}
    <span class="icon">{icon}</span>
  {/if}
  {#if wide && title}
    <span class="label">{title}</span>
  {/if}
</button>

<style>
  .tool-btn {
    background: white;
    text-align: center;
    border: 2px solid black;
    border-radius: 12px;
    cursor: pointer;
    transition: filter 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .tool-btn:hover {
    filter: brightness(0.92);
  }

  /* Square tool buttons (for Eraser, Undo, Redo, Clear) */
  .tool-square {
    width: 50px;
    height: 50px;
  }

  /* Wide buttons (for Save, Email, Random Pattern) */
  .tool-wide {
    padding: 12px 16px;
    justify-content: flex-start;
  }
</style>
