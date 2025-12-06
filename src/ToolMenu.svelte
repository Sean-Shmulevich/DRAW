<script lang="ts">
  import { p5Canvas } from "./global_states";
  let curr_color = $state("#ff77c8");

  let stroke_size = $state(10);
  let pen_state = $state(0);

  let shape_stroke_color = $state("#000000");
  let fill_color = $state("#ff77c8");
  let shape_stroke_size = $state(10);

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

  function setBrushType(arg0: number): any {
    return 0;
  }

  function setShapeType(arg0: string): any {
    throw new Error("Function not implemented.");
  }

  function generatePattern(): any {
    throw new Error("Function not implemented.");
  }

  function sendEmail(): any {
    throw new Error("Function not implemented.");
  }

  function saveLocal(): any {
    throw new Error("Function not implemented.");
  }

  function clearCanvas(): any {
    throw new Error("Function not implemented.");
  }

  function redo(): any {
    throw new Error("Function not implemented.");
  }

  function undo(): any {
    throw new Error("Function not implemented.");
  }

  function selectMiscTool(arg0: string): any {
    throw new Error("Function not implemented.");
  }

  function addPicture(
    e: Event & { currentTarget: EventTarget & HTMLInputElement }
  ): any {
    throw new Error("Function not implemented.");
  }
</script>

<!-- BRUSH SECTION -->
<div class="flex flex-col gap-2 mt-3">
  <label class="text-sm font-semibold text-pink-600">Brush/Pencil/Paint</label>

  <div class="bg-green-200/60 p-3 rounded-xl border border-green-700">
    <div class="flex justify-between items-center">
      <!-- Left: Brush Type Buttons -->
      <div class="flex gap-3">
        <!-- Brush Type 1 -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition"
          title="Soft Brush"
          on:click={() => setBrushType(0)}
        >
          🖌️
        </button>

        <!-- Brush Type 2 -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition"
          title="Marker"
          on:click={() => setBrushType(1)}
        >
          ✏️
        </button>

        <!-- Brush Type 3 -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition"
          title="Calligraphy"
          on:click={() => setBrushType(2)}
        >
          🪶
        </button>
      </div>

      <!-- Right: Color Picker -->
      <div
        class="relative h-10 w-10 rounded-md border border-purple-300 shadow-md cursor-pointer"
        style="background-color: {curr_color};"
      >
        <input
          type="color"
          bind:value={curr_color}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
    <div class="flex flex-col gap-2 mt-5">
      <label class="text-xs font-medium text-red-700">Stroke Size</label>
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
</div>
<!-- OPTIONS PANEL ------------------------------------------- -->
<form class="mt-6 flex flex-col gap-6">
  <!-- Shape Tool Options -->
  <!-- SHAPE TOOL SECTION -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-red-600">Shape Tool</label>

    <div
      class="bg-yellow-100/60 p-4 rounded-xl border border-yellow-400 shadow flex flex-col gap-4"
    >
      <!-- SHAPE BUTTONS (top row) -->
      <div class="flex gap-3 justify-evenly">
        <!-- Triangle -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition flex items-center justify-center"
          title="Triangle"
          on:click={() => setShapeType("triangle")}
        >
          ▲
        </button>

        <!-- Circle -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition flex items-center justify-center"
          title="Circle"
          on:click={() => setShapeType("circle")}
        >
          ●
        </button>

        <!-- Square -->
        <button
          class="h-10 w-10 bg-white border-2 border-black rounded-lg hover:brightness-90 transition flex items-center justify-center"
          title="Square"
          on:click={() => setShapeType("square")}
        >
          ■
        </button>

        <!-- Rectangle -->
        <button
          class="h-10 w-14 bg-white border-2 border-black rounded-lg hover:brightness-90 transition flex items-center justify-center"
          title="Rectangle"
          on:click={() => setShapeType("rectangle")}
        >
          ▭
        </button>
      </div>

      <!-- COLORS (second row, with titles) -->
      <div class="flex flex-row gap-3 justify-evenly">
        <!-- Fill Color -->
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-red-700">Fill Color</span>

          <div
            class="relative h-10 w-10 rounded-md border border-purple-300 shadow-md cursor-pointer"
            style="background-color: {fill_color};"
            title="Fill Color"
          >
            <input
              type="color"
              bind:value={fill_color}
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <!-- Stroke Color -->
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-red-700">Stroke Color</span>

          <div
            class="relative h-10 w-10 rounded-md border border-purple-300 shadow-md cursor-pointer"
            style="background-color: {shape_stroke_color};"
            title="Stroke Color"
          >
            <input
              type="color"
              bind:value={shape_stroke_color}
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <!-- Stroke Size Slider -->
      <div class="flex flex-col gap-1 mt-1">
        <label class="text-xs font-medium text-red-700">Stroke Size</label>
        <input
          type="range"
          min="1"
          max="40"
          bind:value={shape_stroke_size}
          class="w-full accent-red-400 cursor-pointer"
        />
      </div>
    </div>
  </div>

  <!-- MISC TOOLS SECTION -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-blue-600">Misc Tools</label>

    <div class="bg-blue-200/60 p-4 rounded-xl border border-blue-800 shadow">
      <!-- Grid of buttons -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Eraser Tool -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition"
          on:click={() => selectMiscTool("eraser")}
        >
          🧽 <span class="text-sm">Eraser</span>
        </button>

        <!-- Undo -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition"
          on:click={() => undo()}
        >
          ↩️ <span class="text-sm">Undo</span>
        </button>

        <!-- Redo -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition"
          on:click={() => redo()}
        >
          ↪️ <span class="text-sm">Redo</span>
        </button>

        <!-- Clear Canvas -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition"
          on:click={() => clearCanvas()}
        >
          🧼 <span class="text-sm">Clear</span>
        </button>

        <!-- Add Picture -->
        <label
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition cursor-pointer col-span-2"
        >
          📸 <span class="text-sm">Add Picture</span>
          <input
            type="file"
            accept="image/*"
            class="hidden"
            on:change={(e) => addPicture(e)}
          />
        </label>

        <!-- Save to Local -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition col-span-2"
          on:click={() => saveLocal()}
        >
          💾 <span class="text-sm">Save to Local</span>
        </button>

        <!-- Send Email -->
        <button
          class="flex items-center justify-center gap-2 p-3 bg-white rounded-xl border-2 border-black hover:brightness-90 transition col-span-2"
          on:click={() => sendEmail()}
        >
          ✉️ <span class="text-sm">Send Email</span>
        </button>

        <!-- Generate Random Pattern -->
        <button
          class="flex items-center justify-center gap-2 p-3 mt-1 bg-yellow-200 rounded-xl border-2 border-black hover:brightness-90 transition col-span-2"
          on:click={() => generatePattern()}
        >
          🎲 <span class="text-sm">Random Pattern</span>
        </button>
      </div>
    </div>
  </div>
</form>
