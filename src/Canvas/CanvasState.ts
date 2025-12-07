// CanvasState.ts
import type p5 from "p5";
import { createPattern } from "./PatternCreator";
import type { Shape } from "./Shape";
import { getPermanentLayer, clearAll } from "./SyncSubsystem";

export interface Point { x: number; y: number; }

export interface Stroke {
    strokeType: string;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}

let currentStroke: Stroke | null = null;
let strokes: Stroke[] = [];

export let tool: "shape" | "stroke" = "stroke";
export let penSize = 1;
type strokeTypes = ("pencil" | "brush" | "marker");
type shapeTypes = ("rectangle" | "square" | "circle" | "triangle");
export let toolType: strokeTypes | shapeTypes = "pencil";
export let currColor: [number, number, number] = [0, 0, 0];

// -------------------------------
// Accessors (read-only from outside)
// -------------------------------
export function getCurrentStroke() {
    return currentStroke;
}

export function getStrokes() {
    return strokes;
}

export function startStroke() {
    currentStroke = {
        strokeType: toolType,
        penSize,
        color: currColor,
        points: []
    };
}

let lastPoint: Point | null = null;

export function appendPoint(x: number, y: number) {
    if (!currentStroke) return;

    if (!lastPoint) {
        lastPoint = { x, y };
        currentStroke.points.push(lastPoint);
        return;
    }

    const dx = x - lastPoint.x;
    const dy = y - lastPoint.y;
    const distSq = dx * dx + dy * dy;

    // Only add point when moving > 2px
    if (distSq > 4) {
        lastPoint = { x, y };
        currentStroke.points.push(lastPoint);
    }
}

// push points to array for sync and save later on.
export function finishStroke() {
    if (!currentStroke) return null;
    let historyEntry = { tool: "stroke", data: currentStroke };
    currentStroke = null;
    lastPoint = null;
    return historyEntry;
}

// -------------------------------
export function resetCanvas() {
    strokes = [];
    currentStroke = null;
    lastPoint = null;
}

// -------------------------------
export function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    const i = parseInt(hex, 16);
    return [(i >> 16) & 255, (i >> 8) & 255, i & 255];
}

export function drawStroke(p: p5 | p5.Graphics, stroke: Stroke) {
    // Ensure RGB color mode for strokes
    p.colorMode(p.RGB, 255);
    
    const pts = stroke.points;
    if (pts.length < 2) return;

    p.noStroke();
    p.fill(...stroke.color);

    const radius = stroke.penSize / 2;
    const stepMultiplier = 0.8;  // SAFE OPTIMIZATION

    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;

        // Ignore tiny moves
        if (distSq < 1) continue;

        const dist = Math.sqrt(distSq);
        const step = stroke.penSize * stepMultiplier;
        const steps = Math.max(1, Math.floor(dist / step));

        for (let j = 0; j < steps; j++) {
            const t = j / steps;
            const x = a.x + dx * t;
            const y = a.y + dy * t;
            p.circle(x, y, stroke.penSize);
        }
    }
}

// -------------------------------
// Event listener setup
// -------------------------------
export function addListeners(canvas: HTMLCanvasElement, p: p5) {
    if (!canvas || !p) return;

    // Clear canvas
    canvas.addEventListener("canvas:clear", () => {
        clearAll();
        // Also clear local strokes
        strokes.length = 0;
        currentStroke = null;
    });

    // Pen size
    canvas.addEventListener("canvas:pen.setSize", (ev) => {
        const size = (ev as CustomEvent<number>).detail;
        if (!size) return;
        penSize = size;
        p.strokeWeight(size);
    });

    // Pen color
    canvas.addEventListener("canvas:pen.setColor", (ev) => {
        const hex = (ev as CustomEvent<string>).detail;
        const rgb = hexToRgb(hex);

        currColor = rgb;
        p.stroke(...rgb);
    });

    // Tool mode
    canvas.addEventListener("canvas:setTool", (ev) => {
        const { tool: newTool, tool_type } = (ev as CustomEvent<{ tool: string; tool_type: string }>).detail;

        tool = newTool as "shape" | "stroke";            // ← Correct
        toolType = tool_type as strokeTypes | shapeTypes; // ← Correct

        console.log("Tool:", tool, "ToolType:", toolType);
    });

    // Add Picture
    canvas.addEventListener("canvas:addPicture", (ev) => {
        const blob = (ev as CustomEvent<Blob>).detail;
        if (!blob) return;

        const permanent = getPermanentLayer();
        if (!permanent) {
            console.error("Permanent layer not available");
            return;
        }

        const url = URL.createObjectURL(blob);
        p.loadImage(url, (img) => {
            // Draw image to permanent layer so it persists
            permanent.image(img, 0, 0);
            URL.revokeObjectURL(url);
        });
    });
    canvas.addEventListener("canvas:setShape", (ev) => {
        const blob = (ev as CustomEvent<Blob>).detail;
        if (!blob) return;

        const permanent = getPermanentLayer();
        if (!permanent) {
            console.error("Permanent layer not available");
            return;
        }

        const url = URL.createObjectURL(blob);
        p.loadImage(url, (img) => {
            // Draw image to permanent layer so it persists
            permanent.image(img, 0, 0);
            URL.revokeObjectURL(url);
        });
    });

    canvas.addEventListener("canvas:sketch.pattern", () => {
        const permanent = getPermanentLayer();
        if (!permanent) {
            console.error("Permanent layer not available");
            return;
        }

        // Generate random values each time
        const step = Math.floor(Math.random() * 360);
        const zoom = permanent.height / 500;
        const startColour = Math.floor(Math.random() * 360);

        console.log("Creating pattern with step:", step, "zoom:", zoom, "colour:", startColour);
        
        // Draw pattern to permanent layer
        createPattern(permanent, step, zoom, startColour);
        
        console.log("Pattern created");
    });
}