import type p5 from "p5";

export function createPattern(p: p5 | p5.Graphics, fix?: number, zoom?: number, startColour?: number) {
    // Determine if first parameter is p5 instance or Graphics layer
    const isGraphics = (p as any).width !== undefined && (p as any).height !== undefined && (p as any).line !== undefined;
    const layer = isGraphics ? (p as p5.Graphics) : null;
    const p5Instance = isGraphics ? null : (p as p5);
    
    // Use color mode HSB for better color transitions
    if (layer) {
        layer.colorMode(layer.HSB, 360, 100, 100);
    } else if (p5Instance) {
        p5Instance.colorMode(p5Instance.HSB, 360, 100, 100);
    }
    
    let length = 0;
    let step: number;
    let colour: number;

    let rotationAngle = 0;
    const height = layer ? layer.height : (p5Instance ? p5Instance.height : 500);
    let magnify = height / 500;

    const width = layer ? layer.width : (p5Instance ? p5Instance.width : 500);
    const height2 = layer ? layer.height : (p5Instance ? p5Instance.height : 500);
    let oldX = width / 2;
    let oldY = height2 / 2;
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

    // Set stroke weight for better visibility
    if (layer) {
        layer.strokeWeight(2);
    } else if (p5Instance) {
        p5Instance.strokeWeight(2);
    }

    for (let i = 0; i < 360; i++) {
        const strokeColor = colour % 360;
        if (layer) {
            layer.stroke(strokeColor, 100, 50);
        } else if (p5Instance) {
            p5Instance.stroke(strokeColor, 100, 50);
        }

        const cos = layer ? Math.cos : (p5Instance ? p5Instance.cos.bind(p5Instance) : Math.cos);
        const sin = layer ? Math.sin : (p5Instance ? p5Instance.sin.bind(p5Instance) : Math.sin);
        
        newX = length * cos(rotationAngle) + oldX;
        newY = length * sin(rotationAngle) + oldY;

        if (layer) {
            layer.line(oldX, oldY, newX, newY);
        } else if (p5Instance) {
            p5Instance.line(oldX, oldY, newX, newY);
        }

        oldX = newX;
        oldY = newY;
        rotationAngle += step;
        length -= magnify;
        colour += 1;
    }
    
    // Reset color mode to RGB for other drawing operations
    if (layer) {
        layer.colorMode(layer.RGB, 255);
    } else if (p5Instance) {
        p5Instance.colorMode(p5Instance.RGB, 255);
    }
}
