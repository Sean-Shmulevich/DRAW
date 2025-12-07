import { p5Canvas } from "../global_states";
import { get } from "svelte/store";

// Get canvas from writable store (global state)
function getCanvas(): HTMLCanvasElement | null {
    return get(p5Canvas);
}

// --------------------------------------------------
// Brush / Pen
// --------------------------------------------------
export function send_stroke_change(size: number) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:pen.setSize", { detail: size })
    );
}

export function setColor(color: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:pen.setColor", { detail: color })
    );
}

// used for setting all tool types
// can be laster extended to accept more complex objects
// as long as the "tool" is first specified
// right now its only (stroke | shape)
export function setTool(tool: string, tool_type: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:setTool", {
            detail: { tool, tool_type }
        })
    );
}

export function setBrushType(type: number) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:pen.setBrushType", { detail: type })
    );
}

// --------------------------------------------------
// Shapes
// --------------------------------------------------
export function setShapeStrokeSize(size: number) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:shape.setStrokeSize", { detail: size })
    );
}

export function setShapeFillColor(color: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:shape.setFillColor", { detail: color })
    );
}

export function setShapeStrokeColor(color: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:shape.setStrokeColor", { detail: color })
    );
}

// --------------------------------------------------
// Canvas operations
// --------------------------------------------------
export function undo() {
    getCanvas()?.dispatchEvent(new CustomEvent("canvas:undo"));
}

export function clearCanvas() {
    getCanvas()?.dispatchEvent(new CustomEvent("canvas:clear"));
}

export function generatePattern() {
    getCanvas()?.dispatchEvent(new CustomEvent("canvas:sketch.pattern"));
}

// --------------------------------------------------
// Add Picture
// --------------------------------------------------
export function addPicture(blob: Blob) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:addPicture", { detail: blob })
    );
}

// --------------------------------------------------
// Save local
// --------------------------------------------------
export function saveLocal(dataURL: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:save", { detail: dataURL })
    );
}
