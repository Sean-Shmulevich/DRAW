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
    setTool,
    setShapeStrokeSize,
    setShapeFillColor,
    setShapeStrokeColor,
    undo,
    redo,
    clearCanvas,
    generatePattern,
  } from "./Dispatch";
  import DualColorSwatch from "./DualColorSwatch.svelte";
  import ShapePreview from "./ShapePreview.svelte";

  let curr_color = $state("#000000");

  let stroke_size = $state(10);
  let pen_state = $state(0);

  let shape_stroke_color = $state("#000000");
  let fill_color = $state("#FFFFFF");
  let shape_stroke_size = $state(10);

  // which section is currently active? ("brush" or "shape")
  let activeSection = $state<"stroke" | "shape">("stroke");

  // last selected tools for each section
  let current_brush = $state<"pencil" | "brush" | "marker" | "eraser">(
    "pencil"
  );
  let current_shape = $state<"triangle" | "circle" | "square" | "rectangle">(
    "rectangle"
  );

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

  <div
    class="bg-green-200/60 p-3 rounded-xl border-4 ${activeSection === 'stroke'
      ? 'border-4 border-red-600'
      : 'border-green-200'} shadow"
  >
    <div class="flex justify-between items-center">
      <div class="flex gap-3">
        <ToolButton
          icon="✏️"
          active={current_brush === "pencil"}
          title="Pencil"
          onClick={() => {
            if (activeSection !== "stroke") {
              activeSection = "stroke";
            }
            setTool("stroke", "pencil");
            current_brush = "pencil";
          }}
        />
        <ToolButton
          icon="🖌️"
          title="Brush"
          active={current_brush === "brush"}
          onClick={() => {
            if (activeSection !== "stroke") {
              activeSection = "stroke";
            }
            setTool("stroke", "brush");
            current_brush = "brush";
          }}
        />
        <ToolButton
          icon="🪶"
          title="marker"
          active={current_brush === "marker"}
          onClick={() => {
            if (activeSection !== "stroke") {
              activeSection = "stroke";
            }
            setTool("stroke", "marker");
            current_brush = "marker";
          }}
        />

        <ToolButton
          title="Eraser"
          icon="🧽"
          active={current_brush === "eraser"}
          onClick={() => {
            if (activeSection !== "stroke") {
              activeSection = "stroke";
            }
            setTool("stroke", "eraser");
            current_brush = "eraser";
            current_brush = current_brush;
          }}
        />
      </div>

      <ColorSwatch value={curr_color} onChange={setColor} />
    </div>

    <div class="mt-4">
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
      class="bg-yellow-100/60 p-4 rounded-xl border-4 shadow flex flex-col gap-4 ${activeSection ===
      'shape'
        ? 'border-4 border-red-600'
        : 'border-2'}"
    >
      <!-- SHAPE BUTTONS -->
      <div class="flex gap-3 justify-start content-evenly">
        <ToolButton
          icon="▲"
          active={current_shape === "triangle"}
          onClick={() => {
            if (activeSection !== "shape") {
              activeSection = "shape";
            }
            setTool("shape", "triangle");
            current_shape = "triangle";
          }}
        />
        <ToolButton
          icon="●"
          active={current_shape === "circle"}
          onClick={() => {
            if (activeSection !== "shape") {
              activeSection = "shape";
            }
            setTool("shape", "circle");
            current_shape = "circle";
          }}
        />
        <ToolButton
          icon="■"
          active={current_shape === "square"}
          onClick={() => {
            if (activeSection !== "shape") {
              activeSection = "shape";
            }
            setTool("shape", "square");
            current_shape = "square";
          }}
        />
        <ToolButton
          icon="▭"
          active={current_shape === "rectangle"}
          onClick={() => {
            if (activeSection !== "shape") {
              activeSection = "shape";
            }
            setTool("shape", "rectangle");
            current_shape = "rectangle";
          }}
        />
        <div class="ml-auto">
          <DualColorSwatch
            bind:fill={fill_color}
            bind:stroke={shape_stroke_color}
            onFillChange={setShapeFillColor}
            onStrokeChange={setShapeStrokeColor}
          />
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
      <div class="flex flex-col mx-auto -mt-5 -mb-4 allign-center items-center">
        <p class="-mb-3">shape preview</p>
        <ShapePreview
          shape={current_shape as
            | "triangle"
            | "circle"
            | "square"
            | "rectangle"}
          bind:fill={fill_color}
          bind:stroke={shape_stroke_color}
          bind:strokeSize={shape_stroke_size}
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
    {addPicture}
  />
</div>
