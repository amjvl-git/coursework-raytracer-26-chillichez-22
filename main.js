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

// Veiwport & Camera Variables

const aspectRatio = 2;

const veiwportWidth = 2;
const veiwportHeight = veiwportWidth * aspectRatio;

const camPos = new maths.Point3(0, 0, 0);
const horizontal = new maths.Vector3(veiwportWidth, 0, 0);
const vertical = new maths.Vector3(0, veiwportHeight, 0);
const bottomLeftNear = camPos.translated( horizontal.scaled(-0.5) ).translate( vertical.scaled(-0.5) ).translate( new maths.Vector3(0, 0, -focalLength) );

let colour = new maths.Vector3(0, 0, 0);


// Main loop
while (Running){

    if (loops === 10){
        Running = false;
    };

    loops += 1;
};


// Listeners
function resize(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);