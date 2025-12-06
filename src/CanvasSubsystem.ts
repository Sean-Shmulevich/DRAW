import P5 from "p5";
import type p5 from "p5";
import { createPattern } from "./CanvasFunctions/PatternCreator";

let penSize = 1;
let penState = 0;
let currColor: [number, number, number] = [0, 0, 0];


export let p5Instance: p5 | null = null;

export let htmlCanvas: HTMLCanvasElement | null = null;

// --- VECTOR SAVE STRUCTURES ---
export interface Point { x: number; y: number; }

export interface Stroke {
    penState: number;
    penSize: number;
    color: [number, number, number];
    points: Point[];
}

export let strokes: Stroke[] = [];     // all finished strokes
let currentStroke: Stroke | null = null;

function getStrokeColor(p: p5): [number, number, number] {
    const ctx = p.drawingContext;
    const style = ctx.strokeStyle;

    // Force p5 to parse it safely
    const c = p.color(style);

    return [p.red(c), p.green(c), p.blue(c)];
}

function drawStrokeSegment(p: p5, stroke: Stroke) {
    const len = stroke.points.length;
    if (len < 2) return;

    const a = stroke.points[len - 2];
    const b = stroke.points[len - 1];

    p.stroke(...stroke.color);
    p.strokeWeight(stroke.penSize);
    drawByPenState(p, stroke.penState, a, b);
}

function drawByPenState(p: p5, penState: number, a: Point, b: Point) {
    if (penState === 0) p.line(a.x, a.y, b.x, b.y);
    if (penState === 1) p.ellipse(b.x, b.y, 10, 10);
    if (penState === 2) {
        p.line(b.x - 5, b.y - 5, b.x + 5, b.y + 5);
        p.line(b.x + 5, b.y - 5, b.x - 5, b.y + 5);
    }
}

function sketch(p: p5, container: HTMLDivElement) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    p.setup = () => {
        const canvas = p.createCanvas(width * 0.75, height * 0.9);
        // side effects !!!

        canvas.parent(container);

        if (typeof (p as any)._onReady === "function") {
            (p as any)._onReady(canvas.elt);
        }
        canvas.elt.addEventListener("canvas:pen.setSize", (ev: Event) => {
            console.log("GOT PEN SIZE EVENT");
            const size = (ev as CustomEvent<number>).detail;
            if (!size) return;

            penSize = size;        // ← VERY IMPORTANT
            p.strokeWeight(size);
        });
        canvas.elt.addEventListener("canvas:pen.setColor", (ev: Event) => {
            console.log("GOT PEN SIZE EVENT");
            const color = (ev as CustomEvent<string>).detail;
            if (!color) return;

            const rgb = hexToRgb(color); // → [255, 119, 200]
            console.log(rgb);
            p.color(currColor);
            currColor = rgb;
        });
        p.background(255);
    };

    function hexToRgb(hex: string): [number, number, number] {
        hex = hex.replace("#", "");

        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return [r, g, b];
    }

    p.draw = () => {
        if (p.mouseIsPressed) {
            if (penState === 0) {
                p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
                if (!currentStroke) {
                    currentStroke = {
                        penState,
                        penSize,
                        color: currColor,
                        points: []
                    };
                }
                currentStroke.points.push({ x: p.mouseX, y: p.mouseY });
                drawStrokeSegment(p, currentStroke);
            }

            if (penState === 1) {
                p.ellipse(p.mouseX, p.mouseY, 10, 10);
            }

            if (penState === 2) {
                p.line(p.mouseX - 5, p.mouseY - 5, p.mouseX + 5, p.mouseY + 5);
                p.line(p.mouseX + 5, p.mouseY - 5, p.mouseX - 5, p.mouseY + 5);
            }
        }
        else if (currentStroke) {
            strokes.push(currentStroke);
            currentStroke = null;
            console.log(strokes)
        }
    };

    p.keyTyped = () => {
        if (p.key === "c") p.background(255);
        if (p.key === "r") p.stroke(255, 0, 0);
        if (p.key === "b") p.stroke(0, 0, 255);
        if (p.key === "x") penState = 2;
        if (p.key === "e") penState = 1;
        if (p.key === "l") penState = 0;
        if (p.key === "p") {
            createPattern(p);   // pass the p5 instance
        }
    };

    p.keyPressed = () => {
        if (p.key === p.LEFT_ARROW) penSize -= 1;
        if (p.key === p.RIGHT_ARROW) penSize += 1;
        p.strokeWeight(penSize);
    };
}

export const buildP5Canvas = (container: HTMLDivElement): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
        const instance = new P5((p) => {
            // attach a callback that sketch() will call after createCanvas
            (p as any)._onReady = (canvasEl: HTMLCanvasElement) => {
                resolve(canvasEl);
            };

            sketch(p, container);
        });
    });
};