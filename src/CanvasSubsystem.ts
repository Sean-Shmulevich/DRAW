import P5 from "p5";
import type p5 from "p5";

let penSize = 1;
let penState = 0;


export let p5Instance: p5 | null = null;

export let htmlCanvas: HTMLCanvasElement | null = null;

function sketch(p: p5, container: HTMLDivElement) {

    const width = window.innerWidth;
    const height = window.innerHeight;

    p.setup = () => {
        const canvas = p.createCanvas(width * 0.75, height * 0.9);
        let htmlCanvas = canvas.elt;
        canvas.parent(container);
        p.background(255);
    };

    p.draw = () => {
        if (p.mouseIsPressed) {
            if (penState === 0) {
                p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
            }

            if (penState === 1) {
                p.ellipse(p.mouseX, p.mouseY, 10, 10);
            }

            if (penState === 2) {
                p.line(p.mouseX - 5, p.mouseY - 5, p.mouseX + 5, p.mouseY + 5);
                p.line(p.mouseX + 5, p.mouseY - 5, p.mouseX - 5, p.mouseY + 5);
            }
        }
    };

    p.keyTyped = () => {
        if (p.key === "c") p.background(255);
        if (p.key === "r") p.stroke(255, 0, 0);
        if (p.key === "b") p.stroke(0, 0, 255);
        if (p.key === "x") penState = 2;
        if (p.key === "e") penState = 1;
        if (p.key === "l") penState = 0;
    };

    p.keyPressed = () => {
        if (p.key === p.LEFT_ARROW) penSize -= 1;
        if (p.key === p.RIGHT_ARROW) penSize += 1;
        p.strokeWeight(penSize);
    };
}

export const buildP5Canvas = (container: HTMLDivElement) => {
    // side effects but only within this file
    new P5((p) => sketch(p, container));
    if (!htmlCanvas) throw new Error("HTML canvas creation failed");
    return htmlCanvas;
}