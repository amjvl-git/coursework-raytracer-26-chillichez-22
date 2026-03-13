import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import * as renderer from "./renderer.js";

// Assign canvas and ctx, related variables
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas );
export const ctx = canvas.getContext("2d");

// Resive anyway to make sure the canvas is the correct size
resize();

let Running = true;
let loops = 0;

let imageWidth = 400;
let imageHeight = 300;
let aspectRatio = imageHeight/imageWidth

canvas.height = imageHeight
canvas.width = imageWidth

console.log(`Width: ${imageWidth}, Height: ${imageHeight}`);

// Veiwport & Camera Variables

const veiwportWidth = 2;
const veiwportHeight = veiwportWidth * aspectRatio;
const focalLength = 1.0;

const camPos = new maths.Vector3(0, 0, 0);
const horizontal = new maths.Vector3(veiwportWidth, 0, 0);
const vertical = new maths.Vector3(0, veiwportHeight, 0);

/**
 * @type maths.Vector3
 */
const bottomLeftNear = camPos
    .subbed( horizontal.scaled(0.5) )
    .subbed( vertical.scaled(0.5) )
    .subbed( new maths.Vector3( 0, 0, focalLength) )

console.log(`BLN:`, bottomLeftNear)

export const spheres = new Array(

    new shapes.Sphere( 
        new maths.Vector3(0, 0, -1), 
        0.3, 
        0, 
        new maths.Vector3(1, 0, 0) 
    ),

    new shapes.Sphere( 
        new maths.Vector3(0, 0.2, -0.8),
        0.15, 
        1, 
        new maths.Vector3(0, 0, 1) 
    ),
    
    new shapes.Sphere( 
        new maths.Vector3(0, -100.5, -1),
        100, 
        2, 
        new maths.Vector3(0, 1, 0) 
    ) 

);

// Global illumination
const lightDirection = new maths.Vector3( -1.1, -1.3, -1.5 ).normalised();
const antiLightDirection = lightDirection.scaled(-1);

let colour = new maths.Vector3(0, 0, 0);


// Main Ray Tracer

// Iterates over each X and Y
for (let i = 0; i < imageWidth; i++){
    for ( let j = 0; j < imageHeight; j++){

        // Get the UV co-ord from [0 -> 1]
        let u =  i / ( imageWidth - 1);
        let v =  1- j / ( imageHeight - 1);
        
        // Creates ray from camera to each screen point

        const pixelPoint = bottomLeftNear
                .added( horizontal.scaled(u) )
                .added( vertical.scaled(v) );
        
        const rayDir = bottomLeftNear
            .added( horizontal.scaled(u) )
            .added( vertical.scaled(v) )
            .subbed( camPos )

        const ray = new maths.Ray3( 
            camPos,
            rayDir 
        );

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
 * @param {maths.Vector2} x X position, 
 * @param {maths.Vector2} y Y position, 
 * @param {} pixelColour Pixel's colour to be placed
 */
export function drawPixel( canvasCtx, x, y, pixelColour ){

    canvasCtx.fillStyle = `rgb(${pixelColour.x}, ${pixelColour.y}, ${pixelColour.z})`;
    canvasCtx.fillRect(x, y, 1, 1);
}


// Ray Calls

/**
 * Traces the inputted ray, to test for intersection.
 * 
 * @param {maths.Ray3} ray Ray fired from the cam to the screen. 
 * @returns {maths.RayResult3} Result of the traced ray.
 */
function traceRay(ray){

    let t = 1000000000000000
    let closestIndex = -1

    // Gets the closest sphere
    for ( let s = 0; s < spheres.length; s++ ){

        let currentT = spheres[s].rayIntersect(ray);

        if ( currentT > 0 && currentT < t ){

            t = currentT
            closestIndex = s
        }
    }

    // Missed all the spheres
    if (closestIndex < 0){

        return rayMiss()
    }

    return rayHit(ray, t, closestIndex)
}

/**
 *  Return the colour for a point on the screen,
 *  and uses applies lighting model of:
 * 
 *  * Phong - Diffuse Lighting
 *  * Phong - Specular Lighting
 *  * Shadow Casting
 * 
 * @param {maths.Ray3} ray 
 * @returns {maths.Vector3} Pixel Colour, clamped from [0 min -> 1 max]
 */
export function rayColour( ray ){
    
    let rayResult = traceRay(ray);

    // Light misses object
    if  (rayResult.t < 0 ){
        return backgroundColour(ray);
    }

    const albedo = spheres[ rayResult.sphereIndex ].colour;
    const diffuse = Math.max(rayResult.normal.dot( antiLightDirection ), 0 );

    // Specular
    const reflectedLight = lightDirection.subbed( rayResult.normal.scaled( 2 * rayResult.normal.dot(lightDirection) ));
    const viewDirection = camPos.subbed (rayResult.pos );
    const specularContribution = ( Math.max( viewDirection.dot(reflectedLight) , 0) ** 10 ) * 0.8

    const colour = albedo.scaled(0.05 + diffuse + specularContribution);

    return colour 
}

export function backgroundColour(ray){

    const white = new maths.Vector3(1, 1, 1);
    const blue = new maths.Vector3(0.3, 0.5, 0.9);
    const t = 0.5 *( ray.direction.y + 1.0);

    const interploatedColour = white.scaled( 1 - t ).added( blue.scaled(t) );

    return interploatedColour;

}

function rayMiss(){

    return new maths.RayResult3(
        new maths.Vector3(0, 0, 0), 
        new maths.Vector3(0, 0, 0), 
        -1, 
        -1
    )
}

/**
 * 
 * 
 * @param {maths.Ray3} ray 
 * @param {Number} t 
 * @param {Number} sphereIndex 
 * @returns {maths.RayResult3}
 */
function rayHit(ray, t, sphereIndex){
    
    let hitPoint = ray.at(t);
    let normal = hitPoint.subbed( spheres[ sphereIndex ].centre ).normalised();

    return new maths.RayResult3( 
        hitPoint, 
        normal,
        t, 
        sphereIndex
    )

}


// Listeners

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);