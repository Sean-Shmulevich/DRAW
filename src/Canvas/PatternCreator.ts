import type p5 from "p5";

export function createPattern(p: p5, fix?: number, zoom?: number, startColour?: number) {

    let length = 0;
    let step = p.round(p.random(360));
    let colour = p.round(p.random(360));

    let rotationAngle = 0;
    let magnify = p.height / 500;

    let oldX = p.width / 2;
    let oldY = p.height / 2;
    let newX: number;
    let newY: number;

    if (fix != null) step = fix;
    if (zoom != null) magnify = zoom;
    if (startColour != null) colour = startColour;

    p.background(255);
    p.text("colour: " + colour, p.width - 70, 15);

    for (let i = 0; i < 360; i++) {
        p.stroke(colour % 360, 100, 50);

        newX = length * p.cos(rotationAngle) + oldX;
        newY = length * p.sin(rotationAngle) + oldY;

        p.line(oldX, oldY, newX, newY);

        oldX = newX;
        oldY = newY;
        rotationAngle += step;
        length -= magnify;
        colour += 1;
    }

    p.text("fix: " + step, 10, 15);
}