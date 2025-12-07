<script lang="ts">
  import { p5Canvas } from "../global_states";
  import ColorSwatch from "./ColorSwatch.svelte";
  import MiscPanel from "./MiscPanel.svelte";
  import Slider from "./Slider.svelte";
  import ToolButton from "./ToolButton.svelte";

  import {
    send_stroke_change,
    setColor,
    setBrushType,
    change_pen_state,
    setShapeType,
    setShapeStrokeSize,
    setShapeFillColor,
    setShapeStrokeColor,
    undo,
    redo,
    clearCanvas,
    generatePattern,
  } from "./Dispatch";

  let curr_color = $state("#000000");

  let stroke_size = $state(10);
  let pen_state = $state(0);

  let shape_stroke_color = $state("#000000");
  let fill_color = $state("#ff77c8");
  let shape_stroke_size = $state(10);

  function sendEmail(): any {
    throw new Error("Function not implemented.");
    // take a picture of the $p5Canvas and use the email API to create an email with the client os email client.
  }

  function saveLocal(): any {
    // take a picture of the $p5Canvas html element
    // canvas.toDataURL("image/png")
    throw new Error("Function not implemented.");
  }

  function addPicture(): any {
    // canvas:addPicture (image blob)
    // take a picture with the camera then pass the image data blob to the canvas via dispatching the blob to the canvas with an event.
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
          <ColorSwatch value={fill_color} onChange={setShapeFillColor} />
          <span class="text-xs font-sm text-red-700">Fill Color</span>
        </div>

        <!-- Stroke -->
        <div class="flex items-center gap-3 ml-auto">
          <ColorSwatch
            value={shape_stroke_color}
            onChange={setShapeStrokeColor}
          />
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
          onInput={setShapeStrokeSize}
        />
      </div>
    </div>
  </div>

  <!-- MISC TOOLS SECTION -->
  <MiscPanel
    {undo}
    {redo}
    {clearCanvas}
    {saveLocal}
    {sendEmail}
    {generatePattern}
    {change_pen_state}
    {addPicture}
  />
</div>
