import * as maths from "./maths.js";

// Point Lights

/**
 * A global directional light class, that applies light evenly in a 
 * specified direction
 * 
 */
export class DirectionalLight{
    
    /**
     * Creates a global directional light, which has no origin point only 
     * a direction.
     * 
     * @param {maths.Vector3} directionVector Normalised direction for the
     * light to travel.
     * 
     * @param {Number} specularIntensity Intensity of the specular. 
     * (Lower = More Specular).
     * @param {Number} specularSize Size of the specular. 
     * (Higher = Larger Specular Radius).
     * 
     * @param {Number} shadowIntensity Intensity of apllied shadows. 
     * (Higher = Deeper Shadows).
     * 
     * 
     */
    constructor(
        directionVector, 
        specularIntensity, 
        specularSize, 
        shadowIntensity,
        shouldGammaCorrection
         ){

        this.lightDirection = directionVector;
        this.antiLightDirection = directionVector.scaled(-1);

        this.specularIntensity = specularIntensity;
        this.specularSize = specularSize;

        this.shadowIntensity = shadowIntensity;
    }
}