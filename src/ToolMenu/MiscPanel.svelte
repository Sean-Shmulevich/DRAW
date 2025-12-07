<script lang="ts">
  import ToolButton from "./ToolButton.svelte";

  // pass in functions or implement logic here.
  export let undo = () => {};
  export let clearCanvas = () => {
    // Send Clear canvas event
  };
  export let saveLocal = () => {};
  export let sendEmail = () => {};
  export let generatePattern = () => {};
  export let addPicture = () => {};
  export let importImage = () => {};
</script>

<div class="flex flex-col gap-2">
  <label class="text-sm font-semibold text-blue-600">Misc Tools</label>

  <div class="bg-blue-200/60 p-4 rounded-xl border border-blue-800 shadow">
    <div class="grid grid-cols-2 gap-4 place-items-center">
      <!-- SQUARE BUTTONS -->
      <ToolButton
        className="w-full"
        title="Undo"
        icon="↩️"
        wide={true}
        onClick={undo}
      />

      <ToolButton
        title="Clear"
        icon="🧼"
        wide={true}
        className="w-full"
        onClick={clearCanvas}
      />

      <!-- ADD PICTURE -->
      <ToolButton
        icon="📸"
        title="Take Picture"
        className="w-full col-span-2"
        wide={true}
        onClick={addPicture}
      />

      <!-- IMPORT IMAGE -->
      <ToolButton
        icon="🖼️"
        title="Import Image"
        className="w-full col-span-2"
        wide={true}
        onClick={importImage}
      />

      <ToolButton
        icon="🎲"
        title="Random Pattern"
        wide={true}
        onClick={generatePattern}
        className="col-span-2 w-full"
      />
      <ToolButton
        icon="💾"
        title="Save to Local"
        wide={true}
        onClick={saveLocal}
        className="col-span-2 w-full"
      />

      <ToolButton
        icon="✉️"
        title="Send Email"
        wide={true}
        onClick={sendEmail}
        className="col-span-2 w-full"
      />
    </div>
  </div>
</div>
