<script lang="ts">
  import { onMount } from "svelte";
  import { buildP5Canvas } from "./Canvas/CanvasSubsystem";
  import { p5Canvas } from "./global_states";
  import p5 from "p5";

  let container: HTMLDivElement;

  // instantiate p5 canvas
  onMount(async () => {
    const canvas = await buildP5Canvas(container); // waits for p5 setup()
    $p5Canvas = canvas; // store the HTMLCanvasElement
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
