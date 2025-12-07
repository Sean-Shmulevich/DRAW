<script lang="ts">
  import viteLogo from "/vite.svg";
  import P5_Canvas from "./P5_Canvas.svelte";
  import ToolMenu from "./ToolMenu/ToolMenu.svelte";
</script>

<main class="flex flex-row h-screen w-screen bg-red-100">
  <section
    class="sidebar w-[20%] p-4 text-black bg-purple-200 border-r-black border-r-5"
  >
    <div class="flex flex-col justify-start -mt-4 mb-2">
      <h2
        class="text-6xl font-extrabold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent tracking-tight -mb-2"
      >
        DRAW
      </h2>
      <span class="text-sm ml-2 text-black tracking-wide">
        DRAW Really Awesome Works
      </span>
    </div>
    <ToolMenu />
  </section>

  <section class="w-[80%] h-full">
    <div class="mt-[4.5vh] mx-[2.5%]">
      <P5_Canvas />
    </div>
  </section>
</main>

<style>
</style>
