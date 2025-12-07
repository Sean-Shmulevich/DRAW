import type p5 from "p5";

export function createPattern(p: p5, fix?: number, zoom?: number, startColour?: number) {
    // Save current color mode
    const currentColorMode = (p as any)._colorMode;
    
    // Use color mode HSB for better color transitions
    p.colorMode(p.HSB, 360, 100, 100);
    
    let length = 0;
    let step: number;
    let colour: number;

    let rotationAngle = 0;
    let magnify = p.height / 500;

    let oldX = p.width / 2;
    let oldY = p.height / 2;
    let newX: number;
    let newY: number;

    // Use provided values or generate random ones
    if (fix != null) {
        step = fix;
    } else {
        step = Math.floor(Math.random() * 360);
    }
    
    if (zoom != null) {
        magnify = zoom;
    }
    
    if (startColour != null) {
        colour = startColour;
    } else {
        colour = Math.floor(Math.random() * 360);
    }

    // Don't clear background - draw on top of existing content
    // Set stroke weight for better visibility
    p.strokeWeight(2);

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
    
    // Reset color mode to RGB for other drawing operations
    p.colorMode(p.RGB, 255);
}