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
     * @param {maths.Vector3} lightColour Colour of the emmited light. 
     */
    constructor(
        directionVector, 
        lightColour,

    ){

        this.lightDirection = directionVector.normalised();
        this.antiLightDirection = directionVector.normalised().scaled(-1);
        
        this.lightColour = lightColour;

    }
}