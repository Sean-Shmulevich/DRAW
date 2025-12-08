<script lang="ts">
  import { p5Canvas } from "../global_states";
  import ColorSwatch from "./ColorSwatch.svelte";
  import MiscPanel from "./MiscPanel.svelte";
  import Slider from "./Slider.svelte";
  import ToolButton from "./ToolButton.svelte";
  import html2canvas from "html2canvas";

  import {
    send_stroke_change,
    setColor,
    setBrushType,
    setTool,
    setShapeStrokeSize,
    setShapeFillColor,
    setShapeStrokeColor,
    undo,
    clearCanvas,
    generatePattern,
    addPicture as dispatchAddPicture,
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

  async function addPicture(): Promise<void> {
    try {
      // Find the canvas container element
      const canvasContainer = document.querySelector('.canvas-container') as HTMLElement;
      
      if (!canvasContainer) {
        alert('Canvas container not found. Cannot take screenshot.');
        return;
      }

      // Take screenshot of the canvas container using html2canvas
      const canvas = await html2canvas(canvasContainer, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob and save to local
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `draw-screenshot-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          console.error('Failed to convert canvas to blob');
          alert('Failed to save screenshot.');
        }
      }, 'image/png');

    } catch (error) {
      console.error('Failed to take screenshot:', error);
      alert('Failed to take screenshot. Please try again.');
    }
  }

  function importImage(): void {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Convert file to blob and pass to canvas
        dispatchAddPicture(file);
      }
      // Remove input element
      document.body.removeChild(fileInput);
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
  }
</script>

<!-- BRUSH SECTION -->
<div class="flex flex-col gap-2 mt-3">
  <label class="text-sm font-semibold text-pink-600">Brush/Pencil/Paint</label>

  <div class="bg-green-200/60 p-3 rounded-xl border">
    <div class="flex justify-between items-center">
      <div class="flex gap-3">
        <ToolButton
          icon="✏️"
          title="Pencil"
          onClick={() => setTool("stroke", "pencil")}
        />
        <ToolButton
          icon="🖌️"
          title="Brush"
          onClick={() => setTool("stroke", "brush")}
        />
        <ToolButton
          icon="🪶"
          title="marker"
          onClick={() => setTool("stroke", "marker")}
        />

        <ToolButton
          title="Eraser"
          icon="🧽"
          onClick={() => setTool("stroke", "eraser")}
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
        <ToolButton icon="▲" onClick={() => setTool("shape", "triangle")} />
        <ToolButton icon="●" onClick={() => setTool("shape", "circle")} />
        <ToolButton icon="■" onClick={() => setTool("shape", "square")} />
        <ToolButton
          icon="▭"
          wide={true}
          onClick={() => setTool("shape", "rectangle")}
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
    {clearCanvas}
    {saveLocal}
    {sendEmail}
    {generatePattern}
    {addPicture}
    {importImage}
  />
</div>
