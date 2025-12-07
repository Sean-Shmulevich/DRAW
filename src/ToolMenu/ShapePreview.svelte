<script lang="ts">
  export let shape: "triangle" | "circle" | "square" | "rectangle";
  export let fill: string;
  export let stroke: string;
  export let strokeSize: number;

  const size = 60;

  // Convert real stroke size → proportional preview stroke
  $: previewStroke = Math.max(1, strokeSize * 0.35);
</script>

<div class="flex items-center justify-center w-[70px] h-[70px]">
  {#if shape === "circle"}
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - previewStroke}
        {fill}
        {stroke}
        stroke-width={previewStroke}
      />
    </svg>
  {:else if shape === "square"}
    <svg width={size} height={size}>
      <rect
        x={previewStroke}
        y={previewStroke}
        width={size - previewStroke * 2}
        height={size - previewStroke * 2}
        {fill}
        {stroke}
        stroke-width={previewStroke}
      />
    </svg>
  {:else if shape === "rectangle"}
    <svg width={size} height={size}>
      <rect
        x={previewStroke}
        y={size / 4}
        width={size - previewStroke * 2}
        height={size / 2}
        {fill}
        {stroke}
        stroke-width={previewStroke}
      />
    </svg>
  {:else if shape === "triangle"}
    <svg width={size} height={size}>
      <polygon
        points="{size / 2}, {previewStroke}
                {size - previewStroke}, {size - previewStroke}
                {previewStroke}, {size - previewStroke}"
        {fill}
        {stroke}
        stroke-width={previewStroke}
      />
    </svg>
  {/if}
</div>
