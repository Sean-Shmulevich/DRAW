<script lang="ts">
  export let fill: string;
  export let stroke: string;
  export let onFillChange: (color: string) => void = () => {};
  export let onStrokeChange: (color: string) => void = () => {};

  let fillInput: HTMLInputElement;
  let strokeInput: HTMLInputElement;
</script>

<div
  class="relative h-[42px] w-[42px] rounded-md border shadow cursor-pointer overflow-hidden"
>
  <!-- Fill (top half) -->
  <div
    class="absolute top-0 left-0 w-full h-1/2 border-b"
    style="background-color: {fill};"
    title="Fill Color"
    on:click={() => fillInput.click()}
  ></div>

  <!-- Stroke (bottom half) -->
  <div
    class="absolute bottom-0 left-0 w-full h-1/2"
    style="background-color: {stroke};"
    title="Stroke Color"
    on:click={() => strokeInput.click()}
  ></div>

  <!-- Hidden Color Pickers -->
  <input
    bind:this={fillInput}
    type="color"
    class="hidden"
    bind:value={fill}
    on:input={(e) => onFillChange((e.target as HTMLInputElement).value)}
  />

  <input
    bind:this={strokeInput}
    type="color"
    class="hidden"
    bind:value={stroke}
    on:input={(e) => onStrokeChange((e.target as HTMLInputElement).value)}
  />
</div>
