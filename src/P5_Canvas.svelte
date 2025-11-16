<script lang="ts">
  import { onMount } from "svelte";
  import { buildP5Canvas } from "./CanvasSubsystem";

  let container: HTMLDivElement;
  let canvasEle: HTMLCanvasElement | null;

  // instantiate p5 canvas
  onMount(() => {
    canvasEle = buildP5Canvas(container);
  });
</script>

<div
  bind:this={container}
  class="canvas-container border-black rounded-2xl border-8 overflow-hidden"
></div>

<style>
  .canvas-container {
    width: fit-content;
    height: fit-content;
  }
</style>
