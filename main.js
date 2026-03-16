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

let imageWidth = 900;
let imageHeight = 500;
let aspectRatio = imageHeight/imageWidth;

canvas.height = imageHeight;
canvas.width = imageWidth;

// Veiwport & Camera Variables

const veiwportWidth = 2;
const veiwportHeight = veiwportWidth * aspectRatio;
const focalLength = 1.0;

const camPos = new maths.Vector3( 0, 0, 0);
const horizontal = new maths.Vector3( veiwportWidth, 0, 0 );
const vertical = new maths.Vector3( 0, veiwportHeight, 0 );

/**
 * @type maths.Vector3
 */
const bottomLeftNear = camPos
    .subbed( horizontal.scaled( 0.5 ) )
    .subbed( vertical.scaled( 0.5 ) )
    .subbed( new maths.Vector3( 0, 0, focalLength) )


// Scene Objects

const spheres = new Array(

    new shapes.Sphere(  // Red

        new maths.Vector3(  // Centre
            0, 
            0, 
            -1 
        ), 

        0.3,  // Radius
        0,    // Index

        new maths.Vector3( // Colour
            1,
            0, 
            0 
        ),

        1  // Reflectivity
    ),

    new shapes.Sphere( // Blue

        new maths.Vector3( // Centre
            0, 
            0.2, 
            0 
        ),

        0.15,  // Radius
        1,     // Index

        new maths.Vector3( // Colour
            0, 
            0, 
            1 
        ), 
 
        1     // Reflectivity
    ),
    
    new shapes.Sphere( // Green

        new maths.Vector3( // Centre
            0, 
            -100.5, 
            -1 
        ),

        100,  // Radius
        2,    // Index

        new maths.Vector3( // Colour
            0, 
            1, 
            0 
        ),
        
        1    // Reflectivity
    ) 

);

// Global illumination & Settings

const sun = new DirectionalLight( 

    new maths.Vector3( // Direction
        1.1, 
        -1.3,
        -1.5 
    ).normalised(),
    
    new maths.Vector3( // Colour
        1,
        1,
        1
    ).normalised(),

    1.3,      // Specular Intensity
    1,    // Specular Size
    60      // Shadow Intensity
);

const sceneAdditions = new renderer.SceneAdditions( 
    true,    // Gamma Correction
    1,       // MultiSample AntiAliasing (MSAA) Samples
    10        // Max Number of Reflection Bounces
)

console.log(

`Above MSSA 100, load times are 15s<, with little difference

---------------
MSSA: 1
Bounces: 10
Load Time: ~0.9s

---------------
MSSA: 50
Bounces: 10
Load Time: ~8.2s

---------------
MSAA: 75
Bounces: 10
Load Time: ~11.5s

---------------
MSAA: 100
Bounces: 10
Load Time: ~ 15.7s `)


// Main Ray Tracer
let colour = new maths.Vector3(0, 0, 0);
console.log("Started Placing Pixels")
const StartTime = performance.now()

// Iterates over each X and Y
for (let i = 0; i < imageWidth; i++ ){
    for ( let j = 0; j < imageHeight; j++ ){

        colour = new maths.Vector3(0, 0, 0);

        // Get the UV co-ord from [0 -> 1]

        let u =  i / ( imageWidth - 1 );
        let v =  1 - j / ( imageHeight - 1 ); // ( 1 - ), since y is flipped
        

        // MSAA (Multi Sample Anti Aliasing)
        if (sceneAdditions.msaaSampleCount != 1 ){
        
            for (let s = 0; s < sceneAdditions.msaaSampleCount; s++ ){
                
                const msaaPos = bottomLeftNear
                        .added( horizontal.scaled( 
                            u + (Math.random() - 0.5) / imageWidth) )

                        .added( vertical.scaled( 
                            v + (Math.random() - 0.5) / imageHeight) )

                const msaaDir = msaaPos.subbed( camPos );

                const msaaRay = new maths.Ray3(
                    camPos,
                    msaaDir
                )
                
                colour = colour.added( 
                    renderer.rayColour(
                        msaaRay, 
                        camPos,
                        spheres,
                        sun,
                        sceneAdditions) 
                )
            }
            colour.scale( 255 / sceneAdditions.msaaSampleCount )
            
    
        }
        else{ // No MSAA

            // Creates ray from camera to each screen point
    
            const rayDir = bottomLeftNear
                .added( horizontal.scaled(u) )
                .added( vertical.scaled(v) )
                .subbed( camPos )

            const ray = new maths.Ray3( 
                camPos,
                rayDir 
            );

            colour = 
                renderer.rayColour( 
                    ray, 
                    camPos, 
                    spheres, 
                    sun,
                    sceneAdditions )
                .scaled( 255 );
        }

        renderer.drawPixel( ctx, i, j, colour );

    }
}

const EndTime = performance.now();

console.log(`
Finished Placing Pixels
-----------------------
Time: ${(EndTime-StartTime) / 1000}s

Pixels: ${imageWidth * imageHeight} 
Width: ${imageWidth}
Height: ${imageHeight}
-----------------------
Spheres: ${spheres.length}
-----------------------
Phong Diffuse
Phong Specular
    Strength: ${sun.specularIntensity}
    Size: ${sun.specularSize}
Recursive Reflection
    Max Bounces: ${sceneAdditions.maxReflectionBounces}
Shadow Cast
    Strength: ${sun.shadowIntensity}
Gamma Correction: ${sceneAdditions.doGammaCorrection}
MSAA: ${sceneAdditions.msaaSampleCount} Samples `)




// Listeners

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);