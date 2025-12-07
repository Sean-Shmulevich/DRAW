import P5 from "p5";
import type p5 from "p5";

import {
    addListeners,
    getCurrentStroke,
    startStroke,
    appendPoint,
    finishStroke,
    drawStrokeSegment
} from "./CanvasState";

function sketch(p: p5, container: HTMLDivElement) {
    p.setup = () => {
        const canvas = p.createCanvas(
            window.innerWidth * 0.75,
            window.innerHeight * 0.9
        );

        canvas.parent(container);

        (p as any)._onReady?.(canvas.elt);

        addListeners(canvas.elt, p);

        p.background(255);
    };

    p.draw = () => {
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