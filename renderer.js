import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import { DirectionalLight } from "./lights.js";

// Drawing

/**
 * Draw a single pixel on the canvas.
 * 
 * @param {CanvasRenderingContext2D} canvasCtx Canvas' CTX variable
 * @param {Number} x X position, 
 * @param {Number} y Y position, 
 * @param {maths.Vector3} pixelColour Pixel's colour to be placed
 */
export function drawPixel( canvasCtx, x, y, pixelColour ){

    canvasCtx.fillStyle = `rgb(${pixelColour.x}, ${pixelColour.y}, ${pixelColour.z})`;
    canvasCtx.fillRect(x, y, 1, 1);
}


// Ray Calls

/**
 * Traces the inputted ray, to test for intersections.
 * 
 * @param {maths.Ray3} ray Ray fired from the cam to the screen. 
 * @param {Array<shapes.Sphere>} sphereList List of spheres.
 * 
 * @returns {maths.RayResult3} Result of the traced ray.
 */
export function traceRay(ray, sphereList){

    let t = 1000000000000000;
    let closestIndex = -1;

    // Gets the closest sphere
    for ( let s = 0; s < sphereList.length; s++ ){

        let currentT = sphereList[s].rayIntersect(ray);

        if ( currentT > 0 && currentT < t ){

            t = currentT;
            closestIndex = s;
        }
    }

    // Missed all the spheres
    if (closestIndex < 0){

        return rayMiss();
    }

    return rayHit(ray, t, sphereList[closestIndex] );
}

/**
 *  Return the colour for a point on the screen,
 *  and uses applies lighting model of:
 * 
 *  * Phong - Diffuse Lighting
 *  * Phong - Specular Lighting
 *  * Shadow Casting
 * 
 * @param {maths.Ray3} ray Ray fires from the camera to the screen.
 * @param {maths.Vector3} camPos Position of the main camera in the scene.
 * @param {Array<shapes.Sphere>} sphereList List of spheres.
 * @param {DirectionalLight} globalLight The global directional light.
 * 
 * @returns {maths.Vector3} Pixel Colour, clamped from [0 min -> 1 max].
 */
export function rayColour(ray, camPos, sphereList, globalLight ){
    
    let rayResult = traceRay(ray, sphereList);

    // Light misses object
    if  (rayResult.t < 0 ){
        return backgroundColour(ray);
    }

    // Phong Albedo (Base Colour) & Diffuse
    const albedo = sphereList[ rayResult.sphereIndex ].colour;
    const diffuse = Math.max(rayResult.normal.dot( globalLight.antiLightDirection ), 0 );

    // Phong Specular
    const reflectedLight = globalLight.lightDirection.subbed( rayResult.normal.scaled( 2 * rayResult.normal.dot( globalLight.lightDirection) ));
    const viewDirection = camPos.subbed (rayResult.pos );
    const specularContribution = ( Math.max( viewDirection.dot(reflectedLight), 0) ** globalLight.specularIntensity ) * globalLight.specularSize

    // Combines all effects
    const colour = albedo.scaled(diffuse + specularContribution);

    return colour 
}

/**
 * Creates the background gradient by interpolating between blue and
 * white colours.
 * 
 * @param {maths.Ray3} ray 
 * @returns {maths.Vector3}
 */
export function backgroundColour(ray){

    const white = new maths.Vector3(1, 1, 1);
    const blue = new maths.Vector3(0.3, 0.5, 0.9);
    const t = 0.5 *( ray.direction.y + 1.0);

    const interploatedColour = white.scaled( 1 - t ).added( blue.scaled(t) );

    return interploatedColour;

}

/**
 * Return a missed ray hit, with default miss variables.
 * 
 * @returns {maths.RayResult3} Missed ray result.
 */
export function rayMiss(){

    return new maths.RayResult3(
        new maths.Vector3(0, 0, 0), 
        new maths.Vector3(0, 0, 0), 
        -1, 
        -1
    )
}

/**
 * Return a valid ray hit, and finds:
 * 
 * * Hit Point - Vector3
 * * Hit Normal - Vector3
 * 
 * Using the inputted:
 * 
 * * Ray - Ray3
 * * Scalar value ( T ) - Number
 * * Intersection Sphere - Shpere
 * 
 * @param {maths.Ray3} ray Ray fired.
 * @param {Number} t Time (or other scalar) value for the ray hit.
 * @param {shapes.Sphere} sphere Sphere the ray intersected with.
 * 
 * @returns {rays.RayResult3} Valid ray hit result.
 */
export function rayHit(ray, t, sphere){
    
    let hitPoint = ray.at(t);
    let normal = hitPoint.subbed( sphere.centre ).normalised();

    return new maths.RayResult3( 
        hitPoint, 
        normal,
        t, 
        sphere.index
    )

}

