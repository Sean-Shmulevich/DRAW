// ShapeState.ts
import type p5 from "p5";
import { hexToRgb } from "./CanvasState"; // reuse helper
import type { Point, Stroke } from "./CanvasState";

// Shape definitions
export type ShapeType = "rectangle" | "circle" | "triangle" | "square" | "";

export interface Shape {
    type: ShapeType;
    strokeSize: number;
    strokeColor: [number, number, number];
    fillColor: [number, number, number];
    start: Point;
    end: Point;
}

// Internal state
let currentShape: Shape | null = null;

// Shape settings controlled by events
export let shapeType: ShapeType = "rectangle";
let shapeStrokeSize = 10;
let shapeStrokeColor: [number, number, number] = [0, 0, 0];
let fillColor: [number, number, number] = [255, 255, 255];


export function getCurrentShape() {
    return currentShape;
}

// Mutation
export function startShape(x: number, y: number, shapeType: ShapeType) {
    currentShape = {
        type: shapeType,
        strokeSize: shapeStrokeSize,
        strokeColor: shapeStrokeColor,
        fillColor,
        start: { x, y },
        end: { x, y }
    };
}

export function updateShape(x: number, y: number) {
    if (currentShape) {
        currentShape.end = { x, y };
    }
}

export function finishShape() {
    if (currentShape) {
        const historyEntry = { tool: "shape", data: currentShape };
        currentShape = null;
        return historyEntry;
    }
    return null;
}

export function drawShape(p: p5, shape: Shape) {
    // Ensure RGB color mode for shapes
    p.colorMode(p.RGB, 255);
    
    p.stroke(...shape.strokeColor);
    p.strokeWeight(shape.strokeSize);
    p.fill(...shape.fillColor);

    const x = shape.start.x;
    const y = shape.start.y;
    const w = shape.end.x - shape.start.x;
    const h = shape.end.y - shape.start.y;

    switch (shape.type) {
        case "rectangle":
            p.rect(x, y, w, h);
            break;

        case "square":
            const size = Math.min(Math.abs(w), Math.abs(h));
            p.rect(x, y, Math.sign(w) * size, Math.sign(h) * size);
            break;

        case "circle":
            p.ellipse(x + w / 2, y + h / 2, Math.abs(w), Math.abs(h));
            break;

        case "triangle":
            p.triangle(
                x, y + h,
                x + w / 2, y,
                x + w, y + h
            );
            break;
    }
}

// Event listeners for shape UI
export function addShapeListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener("canvas:shape.setShape", (ev) => {
        shapeType = (ev as CustomEvent<ShapeType>).detail;
        console.log(shapeType);
    });

    canvas.addEventListener("canvas:shape.setStrokeSize", (ev) => {
        shapeStrokeSize = (ev as CustomEvent<number>).detail;
    });

    canvas.addEventListener("canvas:shape.setStrokeColor", (ev) => {
        shapeStrokeColor = hexToRgb((ev as CustomEvent<string>).detail);
    });

    canvas.addEventListener("canvas:shape.setFillColor", (ev) => {
        fillColor = hexToRgb((ev as CustomEvent<string>).detail);
    });
}
