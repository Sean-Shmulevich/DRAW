// CanvasState.ts
import type p5 from "p5";
import { createPattern } from "./PatternCreator";

export interface Point { x: number; y: number; }

export interface Stroke {
    penState: number;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}

// -------------------------------
// Internal mutable state
// -------------------------------
let currentStroke: Stroke | null = null;
let strokes: Stroke[] = [];

export let penSize = 1;
export let penState = 0;
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

// -------------------------------
// Mutation functions
// -------------------------------
export function startStroke() {
    currentStroke = {
        penState,
        penSize,
        color: currColor,
        points: []
    };
}

export function appendPoint(x: number, y: number) {
    currentStroke?.points.push({ x, y });
}

export function finishStroke() {
    if (!currentStroke) return;
    strokes.push(currentStroke);
    currentStroke = null;
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

export function drawStrokeSegment(p: p5, stroke: Stroke) {
    const pts = stroke.points;
    if (pts.length < 2) return;

    const a = pts[pts.length - 2];
    const b = pts[pts.length - 1];

    p.stroke(...stroke.color);
    p.strokeWeight(stroke.penSize);

    if (penState === 0) p.line(a.x, a.y, b.x, b.y);
    if (penState === 1) p.ellipse(b.x, b.y, 10, 10);
    if (penState === 2) {
        p.line(b.x - 5, b.y - 5, b.x + 5, b.y + 5);
        p.line(b.x + 5, b.y - 5, b.x - 5, b.y + 5);
    }
}

// -------------------------------
// Event listener setup
// -------------------------------
export function addListeners(canvas: HTMLCanvasElement, p: p5) {
    if (!canvas || !p) return;

    // Clear canvas
    canvas.addEventListener("canvas:clear", () => {
        p.background(255);
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
        penState = (ev as CustomEvent<number>).detail;
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

    canvas.addEventListener("canvas:undo", (ev) => {
        console.log("Hit UNDO BTN");
    });
    canvas.addEventListener("canvas:redo", (ev) => {
        console.log("HIT REDO BTN");
    });
    canvas.addEventListener("canvas:sketch.pattern", () => {

        // Generate random values each time
        const countX = Math.floor(Math.random() * 40) + 10;   // 10–50
        const countY = Math.floor(Math.random() * 40) + 10;   // 10–50
        const seed = Math.floor(Math.random() * 10000);     // arbitrary seed

        createPattern(p, countX, countY, seed);
    });
}