<script lang="ts">
  import { p5Canvas } from "../global_states";
  import ColorSwatch from "./ColorSwatch.svelte";
  import MiscPanel from "./MiscPanel.svelte";
  import Slider from "./Slider.svelte";
  import ToolButton from "./ToolButton.svelte";
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

  $effect(() => {
    const canvas = $p5Canvas;

    if (!canvas) {
      console.log("NO CANVAS");
      return;
    }

    canvas.dispatchEvent(
      new CustomEvent("canvas:shape.setColor", { detail: curr_color })
    );
  });

  $effect(() => {
    const canvas = $p5Canvas;

    if (!canvas) {
      console.log("NO CANVAS");
      return;
    }

    canvas.dispatchEvent(
      new CustomEvent("canvas:shape.setFill", { detail: curr_color })
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

  function change_pen_state(tool_number: number) {
    const canvas = $p5Canvas;

    if (!canvas) {
      return;
    }

    canvas.dispatchEvent(
      new CustomEvent("canvas:setTool", { detail: tool_number })
    );
  }

  // When tool changes → notify canvas
  // effect is reasonable here.

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

  function setColor(color: string): void {
    throw new Error("Function not implemented.");
  }
</script>

<!-- BRUSH SECTION -->
<div class="flex flex-col gap-2 mt-3">
  <label class="text-sm font-semibold text-pink-600">Brush/Pencil/Paint</label>

  <div class="bg-green-200/60 p-3 rounded-xl border">
    <div class="flex justify-between items-center">
      <div class="flex gap-3">
        <ToolButton
          icon="🖌️"
          title="Soft Brush"
          onClick={() => setBrushType(0)}
        />
        <ToolButton icon="✏️" title="Marker" onClick={() => setBrushType(1)} />
        <ToolButton
          icon="🪶"
          title="Calligraphy"
          onClick={() => setBrushType(2)}
        />
      </div>

      <ColorSwatch value={curr_color} onChange={setColor} />
    </div>

    <div class="mt-4">
      <label class="text-xs font-medium text-red-700">Stroke Size</label>
      <Slider
        min={1}
        max={60}
        value={stroke_size}
        onInput={send_stroke_change}
      />
    </div>
  </div>
</div>

<div class="mt-6 flex flex-col gap-6">
  <!-- Shape Tool Options -->
  <div class="flex flex-col gap-2">
    <label class="text-sm font-semibold text-red-600">Shape Tool</label>

    <div
      class="bg-yellow-100/60 p-4 rounded-xl border border-yellow-400 shadow flex flex-col gap-4"
    >
      <!-- SHAPE BUTTONS -->
      <div class="flex gap-3 justify-between">
        <ToolButton icon="▲" onClick={() => setShapeType("triangle")} />
        <ToolButton icon="●" onClick={() => setShapeType("circle")} />
        <ToolButton icon="■" onClick={() => setShapeType("square")} />
        <ToolButton
          icon="▭"
          wide={true}
          onClick={() => setShapeType("rectangle")}
        />
      </div>

      <!-- COLORS -->
      <div class="flex flex-row gap-3 justify-start">
        <!-- Fill -->
        <div class="flex items-center gap-3">
          <ColorSwatch value={fill_color} onChange={setColor} />
          <span class="text-xs font-sm text-red-700">Fill Color</span>
        </div>

        <!-- Stroke -->
        <div class="flex items-center gap-3 ml-auto">
          <ColorSwatch value={shape_stroke_color} onChange={setColor} />
          <span class="text-xs font-sm text-red-700">Stroke Color</span>
        </div>
      </div>

      <!-- Stroke Size Slider -->
      <div class="flex flex-col gap-1 mt-1">
        <label class="text-xs font-sm text-red-700">Stroke Size</label>
        <Slider
          min={1}
          max={40}
          value={shape_stroke_size}
          onInput={send_stroke_change}
        />
      </div>
    </div>
  </div>

  <!-- MISC TOOLS SECTION -->
  <MiscPanel />
</div>
