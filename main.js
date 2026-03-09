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

let imageWidth = canvas.width;
let imageHeight = canvas.height;

console.log(`Width: ${imageWidth}, Height: ${imageHeight}`);

// Veiwport & Camera Variables

const veiwportWidth = 2;
const veiwportHeight = 2;
const focalLength = 1.0;

const camPos = new maths.Point3(0, 0, 0);
const horizontal = new maths.Vector3(veiwportWidth, 0, 0);
const vertical = new maths.Vector3(0, veiwportHeight, 0);

const bottomLeftNear = camPos
    .translated( horizontal.scaled(-0.5) )
    .translated( vertical.scaled(-0.5) )
    .translated( new maths.Vector3(0, 0, -focalLength) );

bottomLeftNear.repr()

let colour = new maths.Vector3(0, 0, 0);

console.log(`bln; Is point: ${ bottomLeftNear instanceof maths.Point3 };`)
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

        let ray = new maths.Ray3( camPos, bottomLeftNear.translated( horizontal.scaled(u) ).translated( vertical.scaled(v) ).translated( camPos ) );

        colour = renderer.rayColour( ray ).scaled( 255 );
        renderer.drawPixel( ctx, i, j, colour );

        if (j === 0 && i === 0) {
            console.log("TOP PIXEL");
            ray.direction.repr();
            colour.repr();
        }

        if (j === imageHeight-1 && i === 0) {
            console.log("BOTTOM PIXEL");
            ray.direction.repr();
            colour.repr();
        }


    }

}

console.log(`Finished Placing Pixels`)



// Listeners
function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);