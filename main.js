import * as maths from "./maths.js";
import * as renderer from "./renderer.js";

// Assign canvas and ctx, related variables
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas );
export const ctx = canvas.getContext("2d");

// Resive anyway to make sure the canvas is the correct size
resize();

let Running = true;
let loops = 0;


let imageWidth = 200;
let imageHeight = 200;

canvas.height = imageHeight
canvas.width = imageWidth

console.log(`Width: ${imageWidth}, Height: ${imageHeight}`);

// Veiwport & Camera Variables

const veiwportWidth = 2;
const veiwportHeight = 2;
const focalLength = 1.0;

const camPos = new maths.Point3(0, 0, 0);
const horizontal = new maths.Vector3(veiwportWidth, 0, 0);
const vertical = new maths.Vector3(0, veiwportHeight, 0);

/**
 * @type maths.Point3
 */
const bottomLeftNear = camPos
    .translated( horizontal.scaled(-0.5) )
    .translated( vertical.scaled(-0.5) )
    .translated( new maths.Vector3(0, 0, -focalLength) );

export const spheres = [
    new maths.Sphere( new maths.Point3(0, 0, -1), 
                      0.3, 0, new maths.Vector3(1, 0, 0) ),

    new maths.Sphere( new maths.Point3(0, 0.2, -0.8),
                      0.15, 1, new maths.Vector3(0, 0, 1)),
    
    new maths.Sphere( new maths.Point3(0, -100.5, -1),
                      100, 2, new maths.Vector3(0,1,0) ) 
];

let colour = new maths.Vector3(0, 0, 0);

// Main loop

// Iterates over each X and Y
for (let i = 0; i <= imageWidth; i++){
    for ( let j = 0; j <= imageHeight; j++){

        let u = i / ( imageWidth - 1);
        let v =  1- j / ( imageHeight - 1);

        // Creates ray from camera to each screen point

        // When using Vector.translated and a point is entered, the function 
        // behaves the same as a vector as long as both dimensions are the 
        // same.

        let ray = new maths.Ray3( camPos, bottomLeftNear.added( horizontal.scaled(u) ).added( vertical.scaled(v) ).vectorFromPoint( camPos ) );

        colour = rayColour( ray ).scaled( 255 );
        drawPixel( ctx, i, j, colour );

    }

}

console.log(`Finished Placing Pixels`)


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


// Ray Calls

function traceRay(ray){


    const sphere = spheres[0];
    if ( sphere.rayIntersect(ray) === -1 ){
        //console.log("false");
        return rayMiss()
    }

    //console.log("true");
    return rayHit(ray); 

}

export function rayColour( ray ){

    let castResult = traceRay(ray);

    if (castResult.t < 0 ){
        return backgroundColour(ray);
    }
    return new maths.Vector3(0,1,0);
}

export function backgroundColour(ray){

    const white = new maths.Vector3(1, 1, 1);
    const blue = new maths.Vector3(0.3, 0.5, 0.9);
    const t = 0.5 *( ray.direction.y + 1.0);

    const interploatedColour = white.scaled( 1 - t ).added( blue.scaled(t) );

    return interploatedColour;

}

function rayMiss(){

    return new maths.RayResult3( new maths.Vector3(0, 0, 0), new maths.Vector3(0, 0, 0), -1, -1)
}

function rayHit(ray, t, sphereIndex){

    return new maths.RayResult3( new maths.Vector3(0,0,0), new maths.Vector3(0,0,0), t, sphereIndex)
}



// Listeners
function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);