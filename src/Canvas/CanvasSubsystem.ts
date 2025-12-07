import P5 from "p5";
import type p5 from "p5";

import {
    addListeners,
    toolType,
    tool,

    // strokes
    getCurrentStroke,
    startStroke,
    appendPoint,
    finishStroke,
    drawStroke,
    getStrokes,

} from "./CanvasState";

import {
    startShape,
    updateShape,
    finishShape,
    getCurrentShape,
    getShapes,
    drawShape,
    addShapeListeners,
    type ShapeType
} from "./Shape";

function sketch(p: p5, container: HTMLDivElement) {
    p.setup = () => {
        const canvas = p.createCanvas(
            window.innerWidth * 0.75,
            window.innerHeight * 0.9
        );

        canvas.parent(container);

        (p as any)._onReady?.(canvas.elt);

        addListeners(canvas.elt, p);
        addShapeListeners(canvas.elt);

        p.background(255);
    };

    p.draw = () => {


        // 2️⃣ Redraw all finished strokes

        for (const s of getStrokes()) {
            drawStroke(p, s);
        }

        if (tool === "stroke") {

            if (p.mouseIsPressed) {
                if (!getCurrentStroke()) startStroke();
                appendPoint(p.mouseX, p.mouseY);

                const stroke = getCurrentStroke();
                if (stroke) drawStroke(p, stroke);
            } else {
                if (getCurrentStroke()) finishStroke();
            }
        }

        if (tool === "shape") {
            if (p.mouseIsPressed) {

                if (!getCurrentShape()) startShape(p.mouseX, p.mouseY, toolType as ShapeType);
                else updateShape(p.mouseX, p.mouseY);
            } else {
                if (getCurrentShape()) finishShape();

            }


            // kinda broken
            const preview = getCurrentShape();
            if (preview) drawShape(p, preview);

        }

    };
}

export function buildP5Canvas(container: HTMLDivElement) {
    return new Promise<HTMLCanvasElement>((resolve) => {
        new P5((p) => {
            (p as any)._onReady = (canvasEl: HTMLCanvasElement) => resolve(canvasEl);
            sketch(p, container);
        });
    });
}