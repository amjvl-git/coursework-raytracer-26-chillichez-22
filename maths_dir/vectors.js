import * as tuples from "./tuples.js";
import * as matrixs from "./matrixs.js";

/*
    BV <- BT -> BP
    |     |     |
    V2 <- T2 -> B2
    |     |     |
    V3 <- T3 -> B3
    |     |     |
    V4 <- T4 -> B4

    BaseVector & BasePoint Inherit from BaseTuple

    Tuple2,3,4 Inherit BaseTuple
    Vector2,3,4 Inherit BaseVector
    Point2,3,4 Inherit BasePoint

    Vector2 & Point2 *also* Inherit from Tuple2
    Vector3 & Point3 *also* Inherit from Tuple3
    Vector4 & Point4 *also* Inherit from Tuple4

*/



// Vectors

/**
 * @template thisName
 */
export class BaseVector extends tuples.BaseTuple{

    
    /**
     * Returns a normalised copy of this vector, with magnitude 1.
     * @returns {Vector3} Normalised copy of this vector.
     */
    normalised(){

        let magnitude = this.getMagnitude();

        return new this.constructor( 
            this.x / magnitude,
            this.y / magnitude,
            this.z / magnitude  );
    }

    /**
     * Returns a scaled copy this vector, scaled by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {thisName} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        let copyVector = this.copy();
        copyVector.scale(scaleFactor);

        return copyVector;
    }

    /**
     * Returns a scaled copy this vector, scaled to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector to.
     * @returns {thisName} Scaled copy of this vector.
     */
    scaledTo(scaleFactor ){

        let copyVector = this.copy();
        copyVector.scaleTo(scaleFactor);

        return copyVector;
    }
}

/**
 * @extends {tuples.Tuple2<Vector2>}
 */
export class Vector2 extends tuples.Tuple2{
    // A 2D vector class

    /**
     * Creates a 2d vector with X and y.
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     */
    constructor (x, y ){

        super(x, y);
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) );
    }

    /**
     * Returns the vector's angle in radians.
     * @returns {Number} Euler radian angle of the vector.
     */
    getAngle(){

        return Math.atan2( this.y, this.x);
    }

    /**
     * Return the slope/gradient of this vector.
     * @returns {Number} Gradient of the vector.
     */
    getSlope(){

        return this.y / this.x;
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
    }

    // Return Calculation

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector2} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x + 
               this.y * otherVector.y 
        

    }

}

/**
 * @extends {tuples.Tuple3<Vector3>}
 */
export class Vector3 extends tuples.Tuple3{
    // A 3D vector class

    /**
     * Creates a 3d vector with x, y, z.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     */
    constructor (x, y, z ){
        super(x, y, z);
    }

    /**
     * Logs the Vector3 to the console.
     */
    repr(){

        super.repr();
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {Vector3} Copy of this Vector.
     */
    copy(){

        return super.copy();
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * 
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) );
    }

    /**
     * Gets the euler rotation for the X, Y, Z angles, measured in radians 
     * 
     * @returns {Array<Number>} [ X_Radian, Y_Radian, Z_Radian ]
     */
    getOrientation(){

        // Y and Z are swapped in the calculation, as it states Z as up & down
        // So Y is Gamma, and Z is Beta

        let denominator = this.getMagnitude();

        let alpha = Math.acos( this.x / denominator );
        let beta = Math.acos( this.z / denominator );
        let gamma = Math.acos( this.y / denominator );
      
        return new Array(alpha, beta, gamma );
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
        this.z = this.z / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
    }

    // Return Calculation

    /**
     * Returns the dot product of this and the inputted vector.
     * 
     * @param {Vector3} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x +
               this.y * otherVector.y +
               this.z * otherVector.z;
    }

    /**
     * Returns the cross product of this andthe inputted vector.
     * 
     * @param {Vector3} otherVector Other vector to dot product against.
     * @returns {Vector3} The dot product of this and otherVector.
     */
    cross(otherVector ){

        return new Vector3(
            ( this.y + otherVector.z ) - ( this.z + otherVector.y ),
            ( this.z + otherVector.x ) - ( this.x + otherVector.z ),
            ( this.x + otherVector.y ) - ( this.y + otherVector.x )
        );

    }

    // Rotations

    /**
     * Rotates this vector about the x-axis by the inputted roation 
     * 
     * Changes only Y and Z, matrix of:
     * 
     * [ 1, 0, 0 ]
     * 
     * [ 0, cos, -sin ]
     * 
     * [ 0, sin, cos ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    xRotate(radianRotation ){

        let y = (this.y * Math.cos(radianRotation) ) - ( this.z * Math.sin(radianRotation ));
        let z = (this.y * Math.sin(radianRotation )) + ( this.z * Math.cos(radianRotation ));

        this.y = y;
        this.z = z;
    }

    /**
     * Rotates this vector about the y-axis by the inputted roation. 
     * 
     * Changes only X and Z, matrix of:
     * 
     * [ 0, cos, sin ]
     * 
     * [ 0, 1, 0 ]
     * 
     * [ 0, -sin, cos ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    yRotate(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) + ( this.z * Math.sin(radianRotation ));
        let z = ( this.z * Math.cos(radianRotation )) - (this.x * Math.sin(radianRotation ));

        this.x = x;
        this.z = z;
    }

    /**
     * Rotates this vector about the z-axis by the inputted roation 
     * 
     * Changes only X and Y, matrix of:
     * 
     * [ 0, cos, -sin ]
     * 
     * [ 0, sin, cos  ]
     * 
     * [ 0, 0, 1 ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    zRotate(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.y * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        this.x = x;
        this.y = y;
    
    }


    /**
     * Returns a copy of this vector rotated about the x-axis by the inputted roation. 
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    xRotated(radianRotation ){

        let y = (this.y * Math.cos(radianRotation) ) - ( this.z * Math.sin(radianRotation ));
        let z = (this.y * Math.sin(radianRotation )) + ( this.z * Math.cos(radianRotation ));

        return new Vector3(this.x, y, z);
    }

    /**
     * Returns a copy of this vector rotated about the y-axis by the inputted roation.
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    yRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) + ( this.z * Math.sin(radianRotation ));
        let z = ( this.z * Math.cos(radianRotation )) - (this.x * Math.sin(radianRotation ));

        return new Vector3(x, this.y, z);
    }


    /**
     * Returns a copy of this vector rotated about the z-axis by the inputted roation.
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    zRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.y * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        return new Vector3(x, y, this.z );
    }
}

/**
 * @extends {tuples.Tuple4<Vector4>}
 */
export class Vector4 extends tuples.Tuple4{
    // A 4D vector class

    /**
     * Creates a 4d vector with x, y, z, w.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     * @param {Number} w W value for the vector.
     */
    constructor(x, y, z, w){

        super(x, y, z, w);

    }

    // Variables

    
    /**
     * Return the vector's magnitude.
     * 
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) + ( this.w ** 2) );
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
        this.z = this.z / magnitude;
        this.w = this.w / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
        this.w = this.w * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
        this.w = this.w * scaleFactor;
    }

    // Return Calculations

    /**
     * Returns the dot product of this and the inputted vector
     * 
     * @param {Vector4} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x +
               this.y * otherVector.y +
               this.z * otherVector.z +
               this.w * otherVector.w;
    }
    
}

// Vector2,3,4 inherting from BaseVector
 
Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector2.prototype[name] = BaseVector.prototype[name];
})

Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector3.prototype[name] = BaseVector.prototype[name];
})

Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector4.prototype[name] = BaseVector.prototype[name];
})


