import P5 from "p5";
import type p5 from "p5";

import {
    addListeners,
    penState,

    // strokes
    getCurrentStroke,
    startStroke,
    appendPoint,
    finishStroke,
    drawStrokeSegment,

} from "./CanvasState";

import {
    startShape,
    updateShape,
    finishShape,
    getCurrentShape,
    getShapes,
    drawShape,
    isShapeTool,
    addShapeListeners
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

        // Draw shapes
        for (const sh of getShapes()) {
            drawShape(p, sh);
        }

        // Draw shape preview
        if (isShapeTool(penState)) {
            console.log("ISSHAPETOOL");
            if (p.mouseIsPressed) {
                if (!getCurrentShape()) startShape(p.mouseX, p.mouseY);
                else updateShape(p.mouseX, p.mouseY);
            } else {
                if (getCurrentShape()) finishShape();
            }

            const preview = getCurrentShape();
            if (preview) drawShape(p, preview);

            return; // exit early: don't draw strokes
        }

        // Draw strokes (unchanged)
        if (p.mouseIsPressed) {
            if (!getCurrentStroke()) startStroke();
            appendPoint(p.mouseX, p.mouseY);

            const stroke = getCurrentStroke();
            if (stroke) drawStrokeSegment(p, stroke);
        } else {
            if (getCurrentStroke()) finishStroke();
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