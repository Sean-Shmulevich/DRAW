import { drawStroke, type Stroke } from "./CanvasState";
import { drawShape, type Shape } from "./Shape";
import P5 from "p5";
import type p5 from "p5";

export let strokes: Stroke[] = [];
export let shapes: Shape[] = [];

export type HistoryEntry =
    | { tool: "stroke"; data: Stroke }
    | { tool: "shape"; data: Shape };

export let history: Array<{ tool: "stroke" | "shape", data: Stroke | Shape }> = new Array();
let permanentLayer: p5.Graphics | null = null;

export function registerPermanentLayer(layer: p5.Graphics) {
    permanentLayer = layer;
}

export function getPermanentLayer(): p5.Graphics | null {
    return permanentLayer;
}

export function rebuildFromHistory() {
    strokes = [];
    shapes = [];


    for (const entry of history) {
        if (entry.tool === "stroke") strokes.push(entry.data as Stroke);
        if (entry.tool === "shape") shapes.push(entry.data as Shape);
    }

}

export function undo() {
    if (history.length === 0 || !permanentLayer) return;


    // remove last action
    history.splice(history.length - 1, 1);
    console.log(history);

    // rebuild state arrays from history
    rebuildFromHistory();

    // clear permanent canvas
    permanentLayer.background(255);

    // redraw shapes
    for (const sh of shapes) {
        drawShape(permanentLayer, sh);
    }

    // redraw strokes
    for (const s of strokes) {
        drawStroke(permanentLayer, s);
    }
}

export function clearAll() {
    if (permanentLayer) {
        permanentLayer.background(255);
    }
    history.length = 0;
    strokes.length = 0;
    shapes.length = 0;
}

export function syncListeners(canvas: HTMLCanvasElement, p: p5) {
    if (!canvas || !p) return;

    canvas.addEventListener("canvas:undo", (ev) => {
        if (!permanentLayer) return;
        console.log("UNDO");
        undo();
    });
}