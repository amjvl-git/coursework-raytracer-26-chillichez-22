import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import * as renderer from "./renderer.js";
import { DirectionalLight } from "./lights.js";

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

// Scene Objects

const spheres = new Array(

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
const sun = new DirectionalLight( 
    new maths.Vector3( -1.1, -1.3, -1.5 ).normalised(),
    2, // SpecInten
    0.8, // SpecSize
    1  // ShadowInten

);


// Main Ray Tracer
let colour = new maths.Vector3(0, 0, 0);

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

        colour = renderer.rayColour( ray, camPos, spheres, sun ).scaled( 255 );

        renderer.drawPixel( ctx, i, j, colour );

    }

}

console.log(`Finished Placing Pixels`)


// Listeners

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);