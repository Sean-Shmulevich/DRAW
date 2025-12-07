<script lang="ts">
  export let value: string;
  export let onChange: (color: string) => void = () => {};
</script>

<div
  class="relative h-10 w-10 rounded-md border shadow-md cursor-pointer"
  style="background-color: {value};"
>
  <input
    type="color"
    bind:value
    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    on:input={(e) => onChange((e.target as HTMLInputElement).value)}
  />
</div>
