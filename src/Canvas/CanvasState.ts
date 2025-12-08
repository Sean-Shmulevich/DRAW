// CanvasState.ts
import type p5 from "p5";
import { createPattern } from "./PatternCreator";
import type { Shape } from "./Shape";

export interface Point { x: number; y: number; }

export interface Stroke {
    strokeType: string;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}


let permanentLayer: p5.Graphics | null = null;

export function registerPermanentLayerStroke(layer: p5.Graphics) {
    permanentLayer = layer;
}

let currentStroke: Stroke | null = null;
let strokes: Stroke[] = [];

export let tool: "shape" | "stroke" = "stroke";
export let penSize = 1;
type strokeTypes = ("pencil" | "brush" | "marker" | "eraser");
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

// Uniformly sample a stroke's points so large/fast movements stay dense.
// spacingFactor is multiplied by pen size and clamped by MIN_SAMPLE_SPACING.
const MIN_SAMPLE_SPACING = 1.2;
type SampleVisitor = (x: number, y: number, a: Point, b: Point, t: number) => void;

function sampleStrokePoints(stroke: Stroke, spacingFactor: number, visit: SampleVisitor) {
    const pts = stroke.points;
    if (pts.length < 2) return;

    const baseSpacing = Math.max(MIN_SAMPLE_SPACING, stroke.penSize * spacingFactor);

    for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 0.25) continue;

        const dist = Math.sqrt(distSq);
        const steps = Math.max(1, Math.ceil(dist / baseSpacing));

        for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            const x = a.x + dx * t;
            const y = a.y + dy * t;
            visit(x, y, a, b, t);
        }
    }
}

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
    return historyEntry;
}

// -------------------------------
export function resetCanvas() {
    strokes = [];
    currentStroke = null;
}

// -------------------------------
export function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace("#", "");
    const i = parseInt(hex, 16);
    return [(i >> 16) & 255, (i >> 8) & 255, i & 255];
}

export function drawStroke(p: p5 | p5.Graphics, stroke: Stroke) {
    // Delegate to brush-specific renderers based on strokeType.
    // Keeps the Stroke data shape unchanged for history/sync compatibility.
    switch (stroke.strokeType) {
        case "pencil":
            drawStrokePencil(p, stroke);
            break;
        case "brush":
            drawStrokeBrush(p, stroke);
            break;
        case "marker":
            drawStrokeMarker(p, stroke);
            break;
        case "eraser":
            drawStrokeEraser(p, stroke);
            break;
        default:
            // Fallback to pencil behavior for unknown types
            drawStrokePencil(p, stroke);
            break;
    }
}

function drawStrokePencil(p: p5 | p5.Graphics, stroke: Stroke) {
    if (stroke.points.length < 2) return;

    p.push();
    p.noStroke();
    const alpha = 110; // light, lets underlying strokes show through
    const [r, g, b] = stroke.color;
    p.fill(r, g, b, alpha);

    sampleStrokePoints(stroke, 0.24, (x, y) => {
        p.circle(x, y, Math.max(1, stroke.penSize * 0.85));
    });

    p.pop();
}

function drawStrokeBrush(p: p5 | p5.Graphics, stroke: Stroke) {
    if (stroke.points.length < 2) return;

    p.push();
    p.noStroke();

    const baseAlpha = 255; // bold, opaque paint
    const [r, g, b] = stroke.color;

    // Smooth, paint stroke aligned to movement direction
    sampleStrokePoints(stroke, 0.12, (x, y, A, B) => {
        const angle = Math.atan2(B.y - A.y, B.x - A.x);

        // Core body: thick, elongated ellipse
        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.fill(r, g, b, baseAlpha);
        p.ellipse(0, 0, stroke.penSize * 1.9, stroke.penSize * 1.2);

        // Soft shoulder to keep edges smooth without visible stippling
        p.fill(r, g, b, Math.floor(baseAlpha * 0.7));
        p.ellipse(0, 0, stroke.penSize * 2.2, stroke.penSize * 1.45);
        p.pop();
    });

    p.pop();
}

function drawStrokeMarker(p: p5 | p5.Graphics, stroke: Stroke) {
    if (stroke.points.length < 2) return;

    p.push();
    p.noStroke();

    const baseAlpha = 230; // fountain-pen ink
    const [r, g, b] = stroke.color;

    p.rectMode((p as any).CENTER || 3); // CENTER constant may be numeric in some builds

    sampleStrokePoints(stroke, 0.2, (x: number, y: number) => {
        // thinner oval for a fountain-pen style line, fixed orientation
        p.fill(r, g, b, baseAlpha);
        p.ellipse(x, y, stroke.penSize * 1.4, stroke.penSize * 0.55);
    });

    p.pop();
}

function drawStrokeEraser(p: p5 | p5.Graphics, stroke: Stroke) {
    if (stroke.points.length < 2) return;

    p.push();
    p.noStroke();
    p.fill(255); // Paint white instead of erasing alpha

    // Use similar sizing to brush for consistency
    sampleStrokePoints(stroke, 0.12, (x, y) => {
        p.circle(x, y, stroke.penSize * 1.6);
    });

    p.pop();
}

// -------------------------------
// Event listener setup
// -------------------------------
export function addListeners(canvas: HTMLCanvasElement, p: p5) {
    if (!canvas || !p) return;

    // Clear canvas
    canvas.addEventListener("canvas:clear", () => {
        p.background(255);
        resetCanvas();
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

        const url = URL.createObjectURL(blob);
        p.loadImage(url, (img) => p.image(img, 0, 0));
    });
    canvas.addEventListener("canvas:setShape", (ev) => {
        const blob = (ev as CustomEvent<Blob>).detail;
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        p.loadImage(url, (img) => p.image(img, 0, 0));
    });

    canvas.addEventListener("canvas:sketch.pattern", () => {
        const countX = Math.floor(Math.random() * 40) + 10;
        const countY = Math.floor(Math.random() * 40) + 10;
        const seed = Math.floor(Math.random() * 10000);

        createPattern(p, permanentLayer!, countX, countY, seed);
    });
}
