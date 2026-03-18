import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import { DirectionalLight } from "./lights.js";

// Classes

/**
 * Class that holds additional settings for the render
 * and ray color functions
 */
export class SceneAdditions{

    /**
     * 
     * 
     * @param {Number} ambientFactor Factor for the base ambient
     * @param {boolean} doGammaCorrection Should gamma correction be apllied.
     * @param {Number} msaaSampleCount Number of samples in a grid the 
     * render uses to check for  
     * @param {Number} maxReflectionBounces Max number of bounces the
     * recursive reflection can use, for a continous sphere
     */
    constructor(
        ambientFactor,
        doGammaCorrection, 
        msaaSampleCount,
        maxReflectionBounces 
    ){

        this.ambientFactor = ambientFactor;
        this.doGammaCorrection = doGammaCorrection;
        this.msaaSampleCount = msaaSampleCount;
        this.maxReflectionBounces = maxReflectionBounces;
    }

}

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

    canvasCtx.fillStyle = 
        `rgb(${pixelColour.x}, ${pixelColour.y}, ${pixelColour.z})`;

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
 * @param {SceneAdditions} sceneAdditions Additional settings for the scene.
 * @param {boolean} isPrimaryRay  If the ray is the first to be fired.
 * 
 * @returns {maths.Vector3} Pixel Colour, clamped from [0 min -> 1 max].
 */
export function rayColour(
    ray, 
    camPos, 
    sphereList, 
    globalLight,
    sceneAdditions,
    isPrimaryRay = true
    ){
    
    let rayResult = traceRay(ray, sphereList);

    // Ray misses object
    if  (rayResult.t < 0 ){
        return backgroundColour(ray);
    }

    const sphere = sphereList[ rayResult.sphereIndex ];

    // Phong Albedo (Base Colour)
    const albedo = sphere.colour;

    // Phong Diffuse
    const diffuseStrength = Math.max( 
        rayResult.normal
            .dot( globalLight.antiLightDirection ),
        0 );
    const diffuse = globalLight.lightColour.scaled( diffuseStrength )


    // Phong Specular
    const reflectedLight = globalLight.lightDirection
        .subbed( rayResult.normal
            .scaled( 2 * rayResult.normal
                .dot(globalLight.lightDirection) 
            )
        );
    
    const viewDirection = camPos.subbed(rayResult.pos );
    const specularStrength = 
        Math.max( 
            viewDirection.dot(reflectedLight), 
            0 
        ) ** globalLight.specularIntensity

    const specular = globalLight.lightColour.scaled( specularStrength );

    // Reflections
    let reflective = new maths.Vector3(0, 0, 0);

    // Starts a recursive tracer
    if ( sphere.reflectivity > 0 ){
        reflective = reflectiveColour( 
            ray, 
            rayResult, 
            camPos,
            sphereList, 
            globalLight,
            sceneAdditions,
            1
        );
    }
    
    // Combines Phong light model and effects
    const diffuseColour = albedo
        .scaled(1 - sphere.reflectivity)
        .multiplied(diffuse);

    const reflectionColour = reflective.scaled(sphere.reflectivity);

    let colour = diffuseColour
        .scaled( sceneAdditions.ambientFactor )
        .added( reflectionColour )
            

    // Shadow Casting

    const shadowRay = new maths.Ray3(
        rayResult.pos
            .added( rayResult.normal
                .scaled(0.05) 
        ),
        globalLight.antiLightDirection 
    );

    const shadowRayResult = traceRay( shadowRay, sphereList )

    // Chooses either specular or shadow, not both
    
    if (shadowRayResult.t >= 0){
        colour.scale( 1/globalLight.shadowIntensity );
    } 
    // 
    else if (isPrimaryRay){
        colour = colour.added(specular); 
    }

    return colour
}

/**
 *  Returns the colour of a traced ray that has been reflected by a mirror.
 * 
 *  * Colour = Mirror * ( reflectivity ) + albedo * ( 1 - reflectivity ).
 * 
 *  Is recursively called. 
 * 
 * @param {maths.Ray3} ray Ray fires from the camera to the screen.
 * @param {maths.RayResult3} rayResult Result of the previous ray intersect
 * 
 * @param {maths.RayResult3} camPos Position of the main camera in the scene.
 * @param {Array<shapes.Sphere>} sphereList List of spheres.
 * @param {DirectionalLight} globalLight The global directional light.
 * 
 * @param {SceneAdditions} sceneAdditions Additional settings for the scene.
 * @param {Number} bounces Number of bounces the ray has taken.
 * 
 * @returns {maths.Vector3} Pixel Colour, clamped from [0 min -> 1 max].
 */

export function reflectiveColour(
    ray, 
    rayResult,
    camPos,
    sphereList,
    globalLight,
    sceneAdditions,
    bounces
    ){
    
    // Failsafe, incase the rucursive goes on too long
    if (sceneAdditions.maxReflectionBounces <= bounces){
        //console.log(`Too many bounces aborting with black colour`)
        return new maths.Vector3(0, 0, 0)
    }

    // Calculates reflection ray
    const reflectedRay = new maths.Ray3(

        rayResult.pos
            .added( rayResult.normal
                .scaled(0.05) 
        ),

        ray.direction
            .subbed( rayResult.normal
                .scaled( 2 * rayResult.normal
                    .dot( ray.direction )
                )
            )
    )

    const reflectedRayResult = traceRay( 
        reflectedRay, 
        sphereList );
    
    // Ray misses object 
    // First recursion break
    if  ( reflectedRayResult.t < 0 ){

        //console.log(`Missed`)
        return backgroundColour( reflectedRay );
    }

    const sphere = sphereList[ reflectedRayResult.sphereIndex ];

    // Recursively calls function, as material is reflective
    if (sphere.reflectivity > 0){

        //console.log(`Bouncing`)
        bounces += 1;   
        const reflectedColour = reflectiveColour( 
            reflectedRay, 
            reflectedRayResult, 
            camPos,
            sphereList, 
            globalLight,
            sceneAdditions,
            bounces
        ); 
        
        const baseColour = rayColour(
            reflectedRay,
            camPos,
            sphereList,
            globalLight,
            sceneAdditions,
            false
        )

        return baseColour
            .scaled( 1 - sphere.reflectivity )
                .added( reflectedColour
                    .scaled( sphere.reflectivity) )

    }
    
    // Sphere not reflective

    // Second recursive break

    // This ***should not*** start another reflective recursion,
    // as this material isnt reflective 
    //console.log(`Unreflective`)
    return rayColour( 
        reflectedRay, 
        camPos, 
        sphereList, 
        globalLight, 
        sceneAdditions ,
        false
    );

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

