import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import * as renderer from "./renderer.js";
import { DirectionalLight } from "./lights.js";

// Assign canvas and ctx, related variables
export const canvas = document.getElementById("mainCanvas");
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

let phongSceneData = await 
    fetch("./preset_scenes/base_scene.json")
        .then(d => d.json());

let reflectionSceneData = await 
    fetch("./preset_scenes/reflection_scene.json")
        .then(d => d.json());

let sceneIndex = 0;
let sphereIndex = 0;

let spheres = null;

// Global illumination & Settings

let sun = new DirectionalLight( 
    new maths.Vector3(0,0,0), new maths.Vector3(0,0,0));

let sceneSettings = new renderer.SceneSettings(0,0,0,0,0,0,0);

/*
console.log(
`
Below are the average loads times i got on a: 2.9Ghz Cpu 16Gb Ram,
load times may vary.
Above MSSA 100, load times are 30s<, with little difference.
Bounces at 10 was more than enough

All Tests Done At Width: 900, Height: 500
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
*/


/**
 * Main JS Ray Tracer function
 * 
 * So it can be easily re-called and re-started with different variables
 */
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
            let v =  1 - j / ( imageHeight - 1 ); // (1 -), since y is flipped
            

            // MSAA (Multi Sample Anti Aliasing)
            for (let s = 0; s < sceneSettings.msaaSampleCount; s++ ){
                
                // Move the position of the pixel, and not the direction
                const msaaPos = bottomLeftNear
                    .added( horizontal.scaled( 
                        u + (Math.random() - 0.5) / imageWidth) )

                    .added( vertical.scaled( 
                        v + (Math.random() - 0.5) / imageHeight) )

                const msaaDir = msaaPos.subbed( camPos );
                
                // Create ray for each sample 
                const msaaRay = new maths.Ray3(
                    camPos,
                    msaaDir
                )
                
                colour = colour.added( 
                    renderer.rayColour(
                        msaaRay, 
                        camPos,
                        imageWidth,
                        imageHeight,
                        spheres,
                        sun,
                        sceneSettings,
                        true // Is the primary ray, so include specular
                    ) 
                )

            }

            // Averages every samples, so colours arent blown out
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
Rays: ${imageWidth 
        * imageHeight 
        * sceneSettings.msaaSampleCount} Rough estimate
Width: ${imageWidth}
Height: ${imageHeight}
-----------------------
Spheres: ${spheres.length}
-----------------------
Phong Ambient
    Strength: ${sceneSettings.ambientFactor}
Phong Diffuse
Phong Specular
    Power: ${sceneSettings.specularPower}
Shadow Cast
    Intensity: ${sceneSettings.shadowIntensity}

Gamma Correction: ${sceneSettings.doGammaCorrection}
Multi Sample Anti Aliasing, (MSAA)
    Samples: ${sceneSettings.msaaSampleCount}
        
Recursive Reflection
    Max Bounces: ${sceneSettings.maxReflectionBounces}
Fresnel Lighting
    Fresnel Power: ${sceneSettings.fresnelPower}
`)
}


/**
 * Converts from hex colour to RGB, by doing bit masking to extract the,
 * red, green, and blue values, and combine them into a hex value.
 * 
 * @param {maths.Vector3} colour RGB Colour as a vector3 
 * @returns {String} Hexcode for the colour
 */
function rgbToHex( colour ) {

    return "#" + (1 << 24 | colour.x << 16 | colour.y << 8 | colour.z )
        .toString(16)
            .slice(1);
}

/**
 * A fast hex to rgb that parses the int to convert the number to,
 * its corresponding letter [A-F], then combines into a vector3 variable.
 * 
 * @param {String} hex Hexcode for the colour
 * @returns {maths.Vector3} RGB colour as a vector 3
 */
function hexToRgb(hexcode) {
    const num = parseInt(hexcode.slice(1), 16);

    return new maths.Vector3(
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    );
}



// Listeners

function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);


// Scene Settings
let sceneSelect = document.getElementById('sceneSelect');
let sceneReload = document.getElementById('sceneReload');

let ambientSlider = document.getElementById('ambientFactor');
let gammaCheckbox = document.getElementById('gammaCheckbox');
let specularSlider = document.getElementById('specularPower');

let shadowIntensitySlider = document.getElementById('shadowIntensity');
let msaaSlider = document.getElementById('msaaSamples');

let bounceSlider = document.getElementById('reflectionBounces');
let fresnelSlider = document.getElementById('fresnelPower');

// Lighting

let lightSliderX = document.getElementById("lightX")
let lightSliderY = document.getElementById("lightY")
let lightSliderZ = document.getElementById("lightZ") 
let lightColourPicker = document.getElementById('lightColour');

// Sphere Selection
let sphereSliderX = document.getElementById("spherePosX")
let sphereSliderY = document.getElementById("spherePosY")
let sphereSliderZ = document.getElementById("spherePosZ")

let radiusSlider = document.getElementById('sphereRadius');
let reflectivitySlider = document.getElementById('sphereReflectivity');
let sphereColourPicker = document.getElementById('sphereColour');


/**
 * Updates the scene settings, spheres, campos, lighting for the changed scene
 * using the corresponding JSON file, and sets the sliders, and buttons 
 * to thier correct values
 */
function changeScene(){

    let sceneData = null

    // Base Phong Demo
    if ( sceneIndex === 1 ){

        sceneData = phongSceneData;
    }

    // Reflection Scene Demo
    else if( sceneIndex === 0 ){

        sceneData = reflectionSceneData;
    } 

    // Failed to load
    else{

        console.log("Scene index: ", sceneIndex)
        throw new Error("Scene JSON failed to load")
    }

    // Replaces camera and BLN co-ord
    camPos = new maths.Vector3(
        sceneData["CamPos"][0],
        sceneData["CamPos"][1],
        sceneData["CamPos"][2]
    );

    bottomLeftNear = camPos
        .subbed(horizontal.scaled(0.5))
        .subbed(vertical.scaled(0.5))
        .subbed(new maths.Vector3(0, 0, focalLength)
    );

    console.log("cam", camPos)

    let sceneSpheres = sceneData["Spheres"];
    spheres = new Array( );

    // Creates each sphere 
    for (let s = 0; s < sceneSpheres.length; s++){

        let newSphere = new shapes.Sphere(
            new maths.Vector3(
                sceneSpheres[s]["centre"][0],
                sceneSpheres[s]["centre"][1],
                sceneSpheres[s]["centre"][2]
            ),
            sceneSpheres[s]["radius"],
            s,
            new maths.Vector3(
                sceneSpheres[s]["colour"][0],
                sceneSpheres[s]["colour"][1],
                sceneSpheres[s]["colour"][2]
            ),
            sceneSpheres[s]["reflectivity"]
        );

        spheres.push( newSphere );
    }
    console.log("Spheres", spheres );

    // Changes the sun, global lighting on the scene
    sun.setLightDirection( new maths.Vector3(
        sceneData["Light"]["lightDirection"][0], 
        sceneData["Light"]["lightDirection"][1], 
        sceneData["Light"]["lightDirection"][2] 
    ) );

    sun.lightColour = new maths.Vector3(
        sceneData["Light"]["lightColour"][0],
        sceneData["Light"]["lightColour"][1],
        sceneData["Light"]["lightColour"][2]
    )
    console.log("light", sun)

    // Changes the scene settings 
    const settings = sceneData["Settings"];

    sceneSettings.ambientFactor = settings["ambientFactor"];
    sceneSettings.specularPower = settings["specularIntensity"];
    sceneSettings.shadowIntensity = settings["shadowIntensity"];
    sceneSettings.doGammaCorrection = (settings["doGammaCorrection"]);
    sceneSettings.msaaSampleCount = settings["msaaSampleCount"];
    sceneSettings.maxReflectionBounces = settings["maxReflectionBounces"];
    sceneSettings.fresnelPower = settings["fresnelPower"];

    lightSliderX.value = sun.lightDirection.x
    lightSliderY.value = sun.lightDirection.y
    lightSliderZ.value = sun.lightDirection.z
    lightColourPicker.value = rgbToHex( sun.lightColour.scaled(255) );

    console.log("settings", sceneSettings)
    console.log("Scene changed to: ", sceneIndex)

    // Updates the scene sliders
    gammaCheckbox.checked = sceneSettings.doGammaCorrection;
    ambientSlider.value = sceneSettings.ambientFactor * 100;
    specularSlider.value = sceneSettings.specularPower * 10; 
    shadowIntensitySlider.value = sceneSettings.shadowIntensity * 100; 
    msaaSlider.value = sceneSettings.msaaSampleCount;
    bounceSlider.value = sceneSettings.maxReflectionBounces;
    fresnelSlider.value = sceneSettings.fresnelPower;

    changeSphere()
}

/**
 * Updates the sphere's settings, sliders, buttons, and colour
 */
function changeSphere(){

    let currentSphere = spheres[ sphereIndex ];

    // Sphere doesnt exist, bug when selecting sphere 4-6 in base model
    if ( sphereIndex >= spheres.length){
        console.log(
            `Cant choose that sphere right now, 
            sphere settings will NOT update. Reverting to 1st Sphere`)
        
        sphereIndex = 0;

        sphereSelect.value = `${sphereIndex}`
        changeSphere()
        return;
    }

    sphereSliderX.value = currentSphere.centre.x
    sphereSliderY.value = currentSphere.centre.y
    sphereSliderZ.value = currentSphere.centre.z

    radiusSlider.value = currentSphere.radius * 100;
    reflectivitySlider.value = currentSphere.reflectivity * 100;  
    sphereColourPicker.value = rgbToHex( currentSphere.colour.scaled(255) );
    
    console.log("sphere currently selected: ", sphereIndex)

}


// Settings

sceneReload.addEventListener('click', () =>{
    startRayTracer();
})

sceneSelect.addEventListener('change', () =>{
    sceneIndex = parseInt(sceneSelect.value);

    changeScene();
})

gammaCheckbox.addEventListener('click', () => {
    sceneSettings.doGammaCorrection = gammaCheckbox.checked
});

ambientSlider.addEventListener('change', () =>{
    sceneSettings.ambientFactor = parseFloat(ambientSlider.value / 100);
})

specularSlider.addEventListener('change', () => {
    sceneSettings.specularPower = parseFloat(specularSlider.value / 10);
})
shadowIntensitySlider.addEventListener('change', () => {
    sceneSettings.shadowIntensity = parseFloat(shadowIntensitySlider.value / 100);
})
msaaSlider.addEventListener('change', () => {
    sceneSettings.msaaSampleCount = parseInt(msaaSlider.value);
})
bounceSlider.addEventListener('change', () => {
    sceneSettings.maxReflectionBounces = parseInt(bounceSlider.value);
})
fresnelSlider.addEventListener('change', () => {
    sceneSettings.fresnelPower = parseInt(fresnelSlider.value);
})

// Lighting


lightSliderX.addEventListener('change', () => {

    sun.setLightDirection( new maths.Vector3(
        parseInt(lightX.value), 
        sun.lightDirection.y, 
        sun.lightDirection.z
        )
    )
})
lightSliderY.addEventListener('change', () => {

    sun.setLightDirection( new maths.Vector3(
        sun.lightDirection.x,
        parseInt(lightY.value), 
        sun.lightDirection.z
        )
    )
})
lightSliderZ.addEventListener('change', () => {

    sun.setLightDirection( new maths.Vector3(
        sun.lightDirection.x,  
        sun.lightDirection.y, 
        parseInt(lightZ.value)
        )
    )
})

lightColourPicker.addEventListener('change', () => {

    console.log("Colour", hexToRgb(lightColourPicker.value).scaled( 1/255) )

    spheres[ sphereIndex ].colour = 
        hexToRgb( lightColourPicker.value )
            .scaled( 1/255);
})

// Spheres

sphereSelect.addEventListener('change', () =>{
    sphereIndex = sphereSelect.value;

    changeSphere()
})


sphereSliderX.addEventListener('change', () => {

    spheres[ sphereIndex ].centre.x = parseInt(sphereSliderX.value);
})
sphereSliderY.addEventListener('change', () => {

    spheres[ sphereIndex ].centre.y = parseInt(sphereSliderY.value);
})
sphereSliderZ.addEventListener('change', () => {

    spheres[ sphereIndex ].centre.z = parseInt(sphereSliderZ.value);
})

radiusSlider.addEventListener('change', () => {
    spheres[ sphereIndex ].radius = parseFloat(radiusSlider.value / 100);
})

reflectivitySlider.addEventListener('change', () => {
    spheres[ sphereIndex ].reflectivity = 
        parseFloat(reflectivitySlider.value / 100);
})

sphereColourPicker.addEventListener('change', () => {

    console.log("Colour", hexToRgb(sphereColourPicker.value).scaled( 1/255) )

    spheres[ sphereIndex ].colour = 
        hexToRgb( sphereColourPicker.value )
            .scaled( 1/255);
})


// Initial call

changeScene()
startRayTracer()