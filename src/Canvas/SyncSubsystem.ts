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

const HISTORY_STORAGE_KEY = "draw-history";

function storageAvailable() {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function persistHistory() {
    if (!storageAvailable()) return;
    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
        console.error("Failed to persist history", err);
    }
}

export function restoreFromStorage(): boolean {
    if (!storageAvailable() || !permanentLayer) return false;
    try {
        const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (!raw) return false;
        const parsed = JSON.parse(raw) as HistoryEntry[];
        if (!Array.isArray(parsed)) return false;
        history = parsed as any;
        rebuildFromHistory();

        // Redraw onto permanent layer
        permanentLayer.background(255);
        for (const sh of shapes) drawShape(permanentLayer, sh);
        for (const s of strokes) drawStroke(permanentLayer, s);
        return true;
    } catch (err) {
        console.error("Failed to restore history", err);
        return false;
    }
}

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

    persistHistory();
}

export function clearAll() {
    if (permanentLayer) {
        permanentLayer.background(255);
    }
    history.length = 0;
    strokes.length = 0;
    shapes.length = 0;

    persistHistory();
}

export function syncListeners(canvas: HTMLCanvasElement, p: p5) {
    if (!canvas || !p) return;

    canvas.addEventListener("canvas:undo", (ev) => {
        if (!permanentLayer) return;
        console.log("UNDO");
        undo();
    });
}