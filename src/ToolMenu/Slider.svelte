<script lang="ts">
  export let min = 1;
  export let max = 60;
  export let value: number;
  export let onInput: (n: number) => void = () => {};
</script>

<input
  type="range"
  {min}
  {max}
  bind:value
  class="w-full accent-pink-400 cursor-pointer"
  on:input={() => onInput(value)}
/>
