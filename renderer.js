import * as maths from "./maths.js";

// Drawing


/**
 * Draw a single pixel on the canvas.
 * 
 * @param {CanvasRenderingContext2D} canvasCtx Canvas' CTX variable
 * @param {maths.Point2} x X position, 
 * @param {maths.Point2} y Y position, 
 * @param {} pixelColour Pixel's colour to be placed
 */
export function drawPixel( canvasCtx, x, y, pixelColour ){

    canvasCtx.fillStyle = `rgb(${pixelColour.x}, ${pixelColour.y}, ${pixelColour.z})`;
    canvasCtx.fillRect(x, y, 1, 1);
}


// Ray maths

export function traceRay( ray ){

    return rayMiss();
}

export function rayMiss(){

    return new maths.RayResult3( new maths.Vector3(0, 0, 0), new maths.Vector3(0, 0, 0), -1, -1);
}


// Colouring

export function rayColour( ray ){

    let rayResult = traceRay( ray );

    // Checks the discriminant
    if ( rayResult.t < 0){
        return backgroundColour( ray );
    }

    // Sphere colour
    return new maths.Vector3(1, 0, 0);
}

export function backgroundColour(ray){

    const white = new maths.Vector3(1, 1, 1);
    const blue = new maths.Vector3(0.3, 0.5, 0.9);
    const t = 0.5 *( ray.direction.y + 1.0);

    const interploatedColour = white.scaled( 1 - t ).added( blue.scaled(t) );

    return interploatedColour;

}