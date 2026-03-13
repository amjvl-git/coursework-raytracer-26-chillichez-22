import * as vectors from "./vectors.js"

// Rays

export class Ray3{
    // A 3D Ray Class

    /**
     * Creates 3D ray from a start position and direction.
     * 
     * @param {points.Point3} startPos Start position / origin of the ray.
     * @param {vectors.Vector3} directionVector Vector for the direction of the vector.
     */
    constructor( startPos, directionVector ){

        this.start = startPos;
        this.direction = directionVector;
    }

    /**
     * Interpolates the start point upto t.
     * 
     * @param {Number} t Scalar t value
     * @returns {points.Point3} Ray at point, when t 
     */
    at(t){

        return this.start.added( this.direction.scaled(t) );
    }

}

export class RayResult3{
    // Ray3 Hit Result class

    /**
     * Creates a hit result for a Ray3.
     * 
     * @param {vectors.Vector3} position Position of the hit.
     * @param {vectors.Vector3} normalVector Normal vector for the hit.
     * @param {Number} time Scalar value (doesnt have to be time) for the hit.
     * @param {Number} sphereIndex Index of the colliding sphere.
     */
    constructor( position, normalVector, time, sphereIndex){

        this.pos = position;
        this.normal = normalVector;
        this.t = time; // Any scalar value for interpolating
        this.sphereIndex = sphereIndex;
    }

}
