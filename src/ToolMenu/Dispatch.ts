import { p5Canvas } from "../global_states";
import { get } from "svelte/store";

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

export function change_pen_state(tool_number: number) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:setTool", { detail: tool_number })
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
export function setShapeType(shape: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:shape.setShape", { detail: shape })
    );
}

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

export function redo() {
    getCanvas()?.dispatchEvent(new CustomEvent("canvas:redo"));
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
// Save local (you can fill in the blob yourself)
// --------------------------------------------------
export function saveLocal(dataURL: string) {
    getCanvas()?.dispatchEvent(
        new CustomEvent("canvas:save", { detail: dataURL })
    );
}