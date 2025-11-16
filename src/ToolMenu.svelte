<script lang="ts">
  let curr_color = "#ff77c8";
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
