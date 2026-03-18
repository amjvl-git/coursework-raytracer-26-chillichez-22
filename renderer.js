import * as maths from "./maths.js";
import * as shapes from "./shapes.js";
import { DirectionalLight } from "./lights.js";

// Classes

/**
 * Class that holds additional settings for the render
 * and ray color functions
 */
export class sceneSettings{

    /**
     * Global settings fot the scene.
     * 
     * @param {Number} ambientFactor Factor for the base ambient
     * @param {Number} specularIntensity Intensity of the specular. 
     * (Lower = More Specular).
     * @param {Number} shadowIntensity Intensity of apllied shadows. 
     * (Higher = Deeper Shadows).
     * 
     * @param {boolean} doGammaCorrection Should gamma correction be apllied.
     * @param {Number} msaaSampleCount Number of random samples to use for
     * the multi sample anti aliasing (MSAA)
     *   
     * @param {Number} maxReflectionBounces Max number of bounces the
     * recursive reflection can use, for a continous sphere
     */
    constructor(
        ambientFactor,
        specularIntensity,
        shadowIntensity,
        doGammaCorrection, 
        msaaSampleCount,
        maxReflectionBounces 
    ){

        this.ambientFactor = ambientFactor;
        this.specularIntensity = specularIntensity;
        this.shadowIntensity = shadowIntensity;
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
 *  Return the colour for a point on the screen, and uses applies lighting 
 *  model of:
 *  
 *  * Variable Lighting Colour
 *  * Phong - Ambient
 *  * Phong - Diffuse Lighting
 *  * Phong - Specular Lighting
 *  * Reflections
 *  * Shadow Casting
 * 
 * @param {maths.Ray3} ray Ray fires from the camera to the screen.
 * @param {maths.Vector3} camPos Position of the main camera in the scene.
 * @param {Array<shapes.Sphere>} sphereList List of spheres.
 * @param {DirectionalLight} globalLight The global directional light.
 * @param {sceneSettings} sceneSettings Additional settings for the scene.
 * @param {boolean} isPrimaryRay  If the ray is the first to be fired.
 * 
 * @returns {maths.Vector3} Pixel Colour, clamped from [0 min -> 1 max].
 */
export function rayColour(
    ray, 
    camPos, 
    sphereList, 
    globalLight,
    sceneSettings,
    isPrimaryRay = true
    ){
    
    // Object intersection tests
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
        rayResult.normal.dot( globalLight.antiLightDirection ),
        0 
    );
    const diffuse = globalLight.lightColour.scaled( diffuseStrength )


    // Phong Specular

    const reflectedLight = globalLight.lightDirection
        .subbed( rayResult.normal
            .scaled( 2 * rayResult.normal
                .dot(globalLight.lightDirection) 
        )
    );
    const viewDirection = camPos.subbed(rayResult.pos );
    
    const specularStrength = Math.max( 
        viewDirection.dot(reflectedLight), 
        0.0 
    ) ** sceneSettings.specularIntensity;

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
            sceneSettings,
            1
        );
    }

    // Makes the colours

    const diffuseColour = albedo
        .scaled(1 - sphere.reflectivity)
        .multiplied(diffuse);

    const reflectionColour = reflective.scaled(sphere.reflectivity);

    // Combines: phong ambient & phong diffuse & reflective
    let colour = diffuseColour
        .scaled( sceneSettings.ambientFactor )
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
        colour.scale( 1 / sceneSettings.shadowIntensity );
    } 

    // Only adds specular on the primary / first ray in a recursive chain,
    // otherwise reflections are noticabley brighter than thier surrounding
    else if (isPrimaryRay){
        colour = colour.added(specular); 
    }

    return colour
}

/**
 *  Calculates the colour of a simulated mirror ( or perfectly reflective ) 
 *  and returns its colour.
 * 
 *  * Colour = Mirror * ( reflectivity ) + albedo * ( 1 - reflectivity ).
 * 
 * 
 *  The function is recursively called when a reflective ray, hits another
 *  reflective surface, upto a max bounces limit set by: 
 *  sceneSettings.maxReflectionBounces; where any more bounces return as a 
 *  black colour.
 * 
 *  * Reflection ray hits nothing -> Background Colour Returned
 * 
 *  * Reflection ray hits non-reflective -> RayColour() on intersection 
 *  sphere
 * 
 *  * Reflection ray hits reflective -> ReflectiveColour() on 
 *  intersection sphere
 * 
 *  * Max bounces reached -> Returns Black Colour
 * 
 * @param {maths.Ray3} ray Previous ray fired into a reflective.
 * @param {maths.RayResult3} rayResult Result of the previous ray intersect.
 * 
 * @param {maths.RayResult3} camPos Position of the main camera in the scene.
 * @param {Array<shapes.Sphere>} sphereList List of scene spheres.
 * @param {DirectionalLight} globalLight The global directional light.
 * 
 * @param {sceneSettings} sceneSettings Additional settings for the scene.
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
    sceneSettings,
    bounces
    ){
    
    /*
    Failsafe, incase the rucursive goes on too long, and eats all the ram,
    but more importantly causes a infinite loop where the reflections may,
    never end as they are constanly bouncing between each other
    */
    if (sceneSettings.maxReflectionBounces <= bounces){

        //console.log(`Too many bounces aborting with black colour`)
        return new maths.Vector3(0, 0, 0)
    }

    // Calculates reflection ray
    const reflectedRay = new maths.Ray3(

        // Scaled by small value to avoid self-sphere intersections,
        // where the ray intersecs with the same sphere it has been,
        // projected from. Causing black points on the sphere.
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
        sphereList 
    );
    
    // First recursion break
    // Ray misses object 
    if  ( reflectedRayResult.t < 0 ){

        //console.log(`Missed`)
        return backgroundColour( reflectedRay );
    }

    const sphere = sphereList[ reflectedRayResult.sphereIndex ];

    // Recursively calls function (if material is reflective) to return,
    // it's colour down the stack frame / recursive loop.
    if (sphere.reflectivity > 0){

        //console.log(`Bouncing`)
        bounces += 1;   

        const reflectedColour = reflectiveColour( 
            reflectedRay, 
            reflectedRayResult, 
            camPos,
            sphereList, 
            globalLight,
            sceneSettings,
            bounces
        ); 
        
        // Calculates the reflections' rayColor otherwise only the sphere's,
        // reflective colour will be shown in the reflection and not the,
        // entire lighting model, when reflectivity != 0
        const baseColour = rayColour(
            reflectedRay,
            camPos,
            sphereList,
            globalLight,
            sceneSettings,
            false // hmmmmmmm idk if we should set this to T/F, 
            // since the reflections wont show the specular
        )

        // Applies reflectivity to the base colour, if the material is 
        // partially reflective, ( reflectivity != 1.00 )
        return baseColour
            .scaled( 1 - sphere.reflectivity )
                .added( reflectedColour
                    .scaled( sphere.reflectivity) )

    }
    
    /*
    Second recursive break

    This ***should not*** start another reflective recursion as this,
    material isnt reflective. And ***should not*** call reflectiveColour()
    inside rayColour()
    
    However when reflectivity approaches zero (but isnt at zero) the material,
    is considered reflecive thus the max bounce was implemented to stop,
    many bounces that wont noticabally change the look of the sphere 
    */

    //console.log(`Unreflective`)
    return rayColour( 
        reflectedRay, 
        camPos, 
        sphereList, 
        globalLight, 
        sceneSettings,
        false // Not a primary ray, so dont add the specular
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

