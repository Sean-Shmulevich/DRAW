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
    type Stroke,

} from "./CanvasState";

import { audioSystem } from "./AudioSystem";

import {
    startShape,
    updateShape,
    finishShape,
    getCurrentShape,
    drawShape,
    addShapeListeners,
    type ShapeType
} from "./Shape";

import { history, registerPermanentLayer, syncListeners, persistHistory, restoreFromStorage } from "./SyncSubsystem";


let permanent: p5.Graphics;   // stores completed artwork
let preview: p5.Graphics;     // cleared every frame


function isInsideCanvas(p: p5) {
    return p.mouseX >= 0 && p.mouseX < p.width &&
        p.mouseY >= 0 && p.mouseY < p.height;
}

function sketch(p: p5, container: HTMLDivElement) {
    p.setup = () => {
        const canvas = p.createCanvas(
            window.innerWidth * 0.75,
            window.innerHeight * 0.9
        );

        // pass in parent container from ToolMenu.svelte
        // add p5 canvas as first child.
        canvas.parent(container);

        (p as any)._onReady?.(canvas.elt);

        permanent = p.createGraphics(p.width, p.height);
        preview = p.createGraphics(p.width, p.height);

        permanent.clear(); // empty transparent
        preview.clear();
        registerPermanentLayer(permanent);


        addListeners(canvas.elt, p);
        addShapeListeners(canvas.elt);
        syncListeners(canvas.elt, p);

        permanent.background(255);

        // Restore any saved history after layers are ready
        restoreFromStorage();
    };

    p.draw = () => {
        // Clear preview each frame to avoid ghosting
        preview.clear();

        // -------------------------------------------
        // 🖊 STROKES (LIVE)
        // -------------------------------------------
        if (tool === "stroke") {
            if (p.mouseIsPressed && isInsideCanvas(p)) {
                if (!getCurrentStroke()) {
                    startStroke();
                    audioSystem.startDrawSound(); // <-- ADDED THIS LINE
                }

                appendPoint(p.mouseX, p.mouseY);

                const live = getCurrentStroke();
                if (live) drawStroke(preview, live);
            } else {
                const finished = getCurrentStroke();
                if (finished) {
                    // 🟢 Move final stroke into permanent layer
                    drawStroke(permanent, finished);
                    const historyEntry = finishStroke();
                    if (historyEntry) {
                        history.push(historyEntry as any);
                        persistHistory();
                    }
                    audioSystem.stopDrawSound(); // <-- ADDED THIS LINE
                }
            }
        }

        // -------------------------------------------
        // 🟦 SHAPES (LIVE)
        // -------------------------------------------
        if (tool === "shape") {
            if (p.mouseIsPressed && isInsideCanvas(p)) {
                if (!getCurrentShape()) {
                    startShape(p.mouseX, p.mouseY, toolType as ShapeType);
                    audioSystem.playClickSound(); // <-- ADDED THIS LINE
                }
                else updateShape(p.mouseX, p.mouseY);
            } else {
                const finished = getCurrentShape();
                if (finished) {
                    // 🟢 Move final shape into permanent layer
                    drawShape(permanent, finished);
                    let historyEntry = finishShape();
                    if (historyEntry) {
                        history.push(historyEntry as any);
                        persistHistory();
                    }
                    audioSystem.playClickSound(); // <-- ADDED THIS LINE
                }
            }

            const previewShape = getCurrentShape();
            if (previewShape) drawShape(preview, previewShape);
        }

        // -------------------------------------------
        // COMPOSITE LAYERS
        // -------------------------------------------
        p.clear();
        p.image(permanent, 0, 0);  // bottom layer
        p.image(preview, 0, 0);  // live preview layer
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
