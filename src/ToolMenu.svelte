<script lang="ts">
  import { p5Canvas } from "./global_states";
  let curr_color = $state("#ff77c8");
  let stroke_size = $state(10);
  let pen_state = $state(0);

  // debounce or dont use effect.
  // wait for user to exit the color picker than send the event.
  // this method is still useful for realtime changing the color of a stroke for a shape or some other canvas object/svg.
  $effect(() => {
    const canvas = $p5Canvas;

    if (!canvas) {
      console.log("NO CANVAS");
      return;
    }

    canvas.dispatchEvent(
      new CustomEvent("canvas:pen.setColor", { detail: curr_color })
    );
  });

  // 🔥 When size changes → notify canvas
  // use effect is reasonable.
  function send_stroke_change(size: number) {
    const canvas = $p5Canvas;

    if (!canvas) {
      console.log("NO CANVAS");
      return;
    }

    canvas.dispatchEvent(
      new CustomEvent("canvas:pen.setSize", { detail: size })
    );
  }

  // When tool changes → notify canvas
  // effect is reasonable here.
  $effect(() => {
    $p5Canvas?.dispatchEvent(
      new CustomEvent("canvas:setTool", { detail: pen_state })
    );
  });
</script>

<nav aria-label="Tool selection">
  <menu class="flex flex-row mx-auto gap-[10px]">
    <button
      class="p-2 bg-blue-200 rounded-2xl border-2 border-black hover:brightness-90 transition"
    >
      <img src="/DRAW/eraser.webp" alt="" />
    </button>
    <button
      class="p-2 bg-green-200 rounded-2xl border-2 border-black hover:brightness-90 transition"
    >
      <img src="/DRAW/pencil.webp" alt="" />
    </button>
    <button
      class="p-2 bg-red-200 rounded-2xl border-2 border-black hover:brightness-90 transition"
    >
      <img src="/DRAW/shape.webp" alt="" />
    </button>
  </menu>
</nav>

<form class="mt-6 flex flex-col gap-6">
  <!-- Brush Size -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-pink-600">Brush Size</label>
    <div class="bg-pink-100/60 p-3 rounded-xl shadow-sm border border-pink-200">
      <input
        type="range"
        min="1"
        max="60"
        bind:value={stroke_size}
        on:input={() => send_stroke_change(stroke_size)}
        class="w-full accent-pink-400 cursor-pointer"
      />
    </div>
  </div>

  <!-- Custom Color Picker -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-purple-600">Color</label>

    <!-- Wrapper bubble -->
    <div
      class="bg-purple-100/60 p-4 rounded-xl shadow-sm border border-purple-200 flex items-center justify-center"
    >
      <!-- Custom circle swatch -->
      <div
        class="relative h-14 w-[95%] rounded-sm border border-purple-300 shadow-md cursor-pointer"
        style="background-color: {curr_color};"
      >
        <!-- Invisible native color input on top -->
        <input
          type="color"
          bind:value={curr_color}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  </div>
</form>
