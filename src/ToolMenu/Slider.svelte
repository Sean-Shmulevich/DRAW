<script lang="ts">
  export let min = 1;
  export let max = 60;
  export let value: number;
  export let onInput: (n: number) => void = () => {};
</script>

<div class="flex items-center gap-3 w-full">
  <!-- Slider -->
  <input
    type="range"
    {min}
    {max}
    bind:value
    class="w-full accent-pink-400 cursor-pointer"
    on:input={() => onInput(value)}
  />

  <!-- Fixed preview container -->
  <div
    class="flex items-center justify-center"
    style="width: {max}px; height: {max}px;"
  >
    <!-- Actual circle that scales -->
    <div
      class="rounded-full bg-black border border-gray-400"
      style="
        width: {value}px;
        height: {value}px;
      "
    ></div>
  </div>
</div>
