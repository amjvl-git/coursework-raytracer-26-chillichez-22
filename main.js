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

let camPos = new maths.Vector3( 0, 0, 0);
let horizontal = new maths.Vector3( veiwportWidth, 0, 0 );
let vertical = new maths.Vector3( 0, veiwportHeight, 0 );

/**
 * @type maths.Vector3
 */
let bottomLeftNear = camPos
    .subbed( horizontal.scaled( 0.5 ) )
    .subbed( vertical.scaled( 0.5 ) )
    .subbed( new maths.Vector3( 0, 0, focalLength) )


// Scene Objects

const spheres = new Array(

    new shapes.Sphere(  // Red - Central

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

    new shapes.Sphere( // Pink - Behind

        new maths.Vector3( // Centre
            0.2, 
            0.2, 
            0.1 
        ),

        0.15,  // Radius
        1,     // Index

        new maths.Vector3( // Colour
            1, 
            0, 
            1 
        ), 
 
        0    // Reflectivity
    ),

    new shapes.Sphere( // Blue - Top

        new maths.Vector3( // Centre
            0, 
            0.25, 
            -0.75 
        ),

        0.15,  // Radius
        2,     // Index

        new maths.Vector3( // Colour
            0, 
            0, 
            1 
        ), 
 
        0  // Reflectivity
    ),
    
    new shapes.Sphere( // Green - Floor

        new maths.Vector3( // Centre
            0, 
            -100.5, 
            -1 
        ),

        100,  // Radius
        3,    // Index

        new maths.Vector3( // Colour
            0, 
            1, 
            0 
        ),
        
        0    // Reflectivity
    ),

    new shapes.Sphere( // Yellow - Right

        new maths.Vector3( // Centre
            -0.3, 
            0, 
            -0.4
        ),

        0.15,  // Radius
        4,     // Index

        new maths.Vector3( // Colour
            1, 
            1, 
            0 
        ), 
 
        1    // Reflectivity
    ),

    new shapes.Sphere( // Teal - Right

        new maths.Vector3( // Centre
            0.3, 
            0, 
            -0.4
        ),

        0.15,  // Radius
        5,     // Index

        new maths.Vector3( // Colour
            0, 
            1, 
            1 
        ), 
 
        0.5    // Reflectivity
    ),


);

// Global illumination & Settings


/* Directly down

const sun = new DirectionalLight(

    new maths.Vector3( // Direction
        0, 
        -1,
        0
    ).normalised(),

    new maths.Vector3( // Colour
        1,
        1,
        1
    ).normalised(),
) */


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

    4,      // Specular Intensity
    10      // Shadow Intensity
);

const sceneSettings = new renderer.sceneSettings( 
    
    1,         // Ambient light factor 
    true,      // Gamma Correction
    25,        // MultiSample AntiAliasing (MSAA) Samples
    10         // Max Number of Reflection Bounces
)

console.log(
`
Below are the average loads times i got on a: 2.9Ghz Cpu 16Gb Ram,
load times may vary.
Above MSSA 100, load times are 30s<, with little difference.
Bounces at 10 was more than enough

All Tests Done At Width: 900, Hieght: 500
---------------
MSSA: 1
Bounces: 10
Load Time: ~1.1s

---------------
MSSA: 25
Bounces: 10
Load Time: ~7.8s


---------------
MSSA: 50
Bounces: 10
Load Time: ~14.1s

---------------
MSAA: 75
Bounces: 10
Load Time: ~19.6s

---------------
MSAA: 100
Bounces: 10
Load Time: ~ 27.4s 

--------------- 
Super Mega Ultra Test:
FUllSCREEN: 1700x1000p
MSAA: 100
Bounces: 10
Load Time: ~96s 
`)

function startRayTracer(){
        
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
        
            for (let s = 0; s < sceneSettings.msaaSampleCount; s++ ){
                
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
                        sceneSettings,
                        true
                    ) 
                )
            }

            // Averages samples
            colour.scale( 1 / sceneSettings.msaaSampleCount )
            
            // Gamma Correction
            if (sceneSettings.doGammaCorrection){
                
                colour.pow( (1/2.2) );
            }


            renderer.drawPixel( ctx, i, j, colour.scaled(255) );

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
Phong Ambient
    Strength: ${sceneSettings.ambientFactor}
Phong Diffuse
Phong Specular
    Strength: ${sun.specularIntensity}
    Size: ${sun.specularSize}
Shadow Cast
    Strength: ${sun.shadowIntensity}

Gamma Correction: ${sceneSettings.doGammaCorrection}
Multi Sample Anti Aliasing, (MSAA)
    Samples: ${sceneSettings.msaaSampleCount}
        
Recursive Reflection
    Max Bounces: ${sceneSettings.maxReflectionBounces}
`)

}

startRayTracer();

// Listeners
function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);