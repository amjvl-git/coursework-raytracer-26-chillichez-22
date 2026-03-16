import * as matrixs from "./matrixs.js";


// Vectors

/**
 * @template Vector3
 */
export class BaseVector{
    

    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets returns it:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Vector3}
     */
    matrixMultiplied( otherMatrix ){

        const copyVector = this.copy()
        copyVector.matrixMultiply( otherMatrix );

        return copyVector;
    }
    

}

/**
 * @extends {BaseVector}
 */
export class Vector2 extends BaseVector{
    // A 2D vector class

    /**
     * Creates a 2d vector with X and y.
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     */
    constructor (x, y ){

        super(x, y);
    }
    
    /**
     * Logs the vector to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {Vector3} Copy of this Vector.
     */
    copy(){

        return new this.constructor( this.x, this.y );
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
     * Adds the inputted vector to this:
     * this = this + otherVector
     * 
     * @param {Vector3} otherVector Vector to add to this.
     */
    add(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
    }

    /**
     * Subtracts the inputted vector from this:
     * this = this - otherVector
     * 
     * @param {Vector3} otherVector Vector to sub from this.
     */
    sub(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
    }
 
    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new matrixs.Matrix([ [this.x], [this.y] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
    }
    
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
     * Returns the addition of this and the inputted vector:
     * return = this + otherVector
     * 
     * @param {Vector2} otherVector Vector to add to this.
     */
    added(otherVector ){

        return new Vector4( 
            this.x + otherVector.x,
            this.y + otherVector.y
        )
    }

    /**
     * Returns the subtraction of this and the inputted vector:
     * return = this - otherVector
     * 
     * @param {Vector2} otherVector Vector to sub from this.
     */
    subbed(otherVector ){

        return new Vector4( 
            this.x - otherVector.x,
            this.y - otherVector.y
        )
    }

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     * 
     * @returns {Vector2} Copy of this vector normalised.
     */
    normalised(){

        let magnitude = this.getMagnitude();
        return new Vector2( 
            this.x / magnitude,
            this.y / magnitude
        )
    }

    /**
     * Scales this vector by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector by.
     * @returns {Vector2} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        return new Vector2(
            this.x * scaleFactor,
            this.y * scaleFactor
        )
    }

    /**
     * Scales this vector to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector to.
     * @returns {Vector2} Scaled copy of this vector.
     */
    scaledTo(scaleFactor ){

        const magnitude = this.magnitude();

        return new Vector2(
            this.x / magnitude * scaleFactor,
            this.y / magnitude * scaleFactor
        )   
    }

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector2} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x + 
               this.y * otherVector.y 
        

    }

    // Rotation
    
    /**
     * Rotates this vector clock-wise by the inputted rotation.
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    rotate(radianRotation ){

        this.x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        this.y = (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));
    }

    /**
     * Returns a copy of this vector rotated clock-wise by the inputted rotation.
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector2} Copy of this vector rotated.
     */
    rotated(radianRotation ){

        return new this.constructor(
            (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation )),
            (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ))
        )
    }

}

/**
 * Creates a Vector 3 vector, with independent X, Y, Z axis
 * 
 * @extends {BaseVector}
 */
export class Vector3 extends BaseVector{
    // A 3D vector class

    /**
     * Creates a 3d vector with x, y, z.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     */
    constructor (x, y, z ){
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Logs the Vector3 to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y}, ${this.z} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {Vector3} Copy of this Vector.
     */
    copy(){

        return new Vector3( this.x, this.y, this.z)
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
     * Adds the inputted vector to this:
     * this = this + otherVector
     * 
     * @param {Vector3} otherVector Vector to add to this.
     */
    add(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
        this.z = this.z + otherVector.z;
    }

    /**
     * Subtracts the inputted vector from this:
     * this = this - otherVector
     * 
     * @param {Vector3} otherVector Vector to sub from this.
     */
    sub(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
        this.z = this.z - otherVector.z;
    }

    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        let vectorMatrix = new matrixs.Matrix([ [this.x], [this.y], [this.z] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
    }

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

    /**
     * Raises this vector by the power.
     * 
     * @param {Number} power 
     */
    pow( power ){

        this.x = this.x ** power;
        this.y = this.y ** power;
        this.z = this.z ** power;
    }

    // Return Calculation

    /**
     * Adds the inputted vector from this:
     * return = this + otherVector.
     * 
     * @param {Vector3} otherVector vector to add from this.
     * @returns {Vector3} Copy of this + otherVector.
     */
    added(otherVector ){

        return new Vector3( 
            this.x + otherVector.x,
            this.y + otherVector.y,
            this.z + otherVector.z
        )

    }

    /**
     * Subtracts the inputted vector from this:
     * return = this - otherVector.
     * 
     * @param {Vector3} otherVector Vector to sub from this.
     * @returns {Vector3} Copy of this - otherVector.
     */
    subbed(otherVector ){

        return new Vector3( 
            this.x - otherVector.x,
            this.y - otherVector.y,
            this.z - otherVector.z
        )
    }

    
    /**
     * Return this vector normalised to a unit vector, with magnitude 1.
     * 
     * @returns {Vector3} Normalised copy of this vector.
     */
    normalised(){

        let magnitude = this.getMagnitude();

        return new Vector3(
            this.x / magnitude,
            this.y / magnitude,
            this.z / magnitude
        )
    }

    /**
     * Returns a scaled copy this vector, scaled by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {Vector3} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        return new Vector3( 
            this.x * scaleFactor,
            this.y * scaleFactor,
            this.z * scaleFactor
            )
    }

    /**
     * Returns a scaled copy this vector, scaled to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector to.
     * @returns {Vector3} Scaled copy of this vector.
     */
    scaledTo(scaleFactor ){


        return new Vector3( 
            this.x / magnitude * scaleFactor,
            this.y / magnitude * scaleFactor,
            this.z / magnitude * scaleFactor
        )
    }

    /**
     * Returns a copy of this vector raised to the inputted power.
     * 
     * @param {Number} power 
     */
    powed( power ){

        return new Vector3( 
            this.x ** power,
            this.y ** power,
            this.z ** power
        )
    }

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
     * @returns {Vector3} The cross product of this and otherVector.
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
 * Creates a Vector 4, with indpendent X, Y, Z, W axis.
 * 
 * @extends {BaseVector}
 */
export class Vector4 extends BaseVector{
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

    
    /**
     * Logs the vector to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y}, ${this.z}, ${this.w} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {Vector4} Copy of this Vector.
     */
    copy(){

        return new this.constructor( this.x, this.y, this.z, this.w );
    }


    // Variables
    
    /**
     * Return the vector's magnitude.
     * 
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( 
            ( this.x ** 2) + 
            ( this. y ** 2) + 
            ( this.z ** 2) + 
            ( this.w ** 2) )
    }

    // Calculations
        
    /**
     * Adds the inputted vector to this:
     * this = this + otherVector
     * 
     * @param {Vector4} otherVector Vector to add to this.
     */
    add(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
        this.z = this.z + otherVector.z;
        this.w = this.w + otherVector.w;
    }

    /**
     * Subtracts the inputted vector from this:
     * this = this - otherVector
     * 
     * @param {Vector4} otherVector Vector to sub from this.
     */
    sub(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
        this.z = this.z - otherVector.z;
        this.w = this.w - otherVector.w;
    }

    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply(otherMatrix ){

        vectorMatrix = new matrixs.Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
        this.w = vectorMatrix[3][0];
    }
    
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
     * Returns the addition of this and the inputted vector:
     * return = this + otherVector
     * 
     * @param {Vector4} otherVector Vector to add to this.
     */
    added(otherVector ){

        return new Vector4( 
            this.x + otherVector.x,
            this.y + otherVector.y,
            this.z + otherVector.z,
            this.w + otherVector.w
        )
    }

    /**
     * Returns the subtraction of this and the inputted vector:
     * return = this - otherVector
     * 
     * @param {Vector4} otherVector Vector to sub from this.
     */
    subbed(otherVector ){

        return new Vector4( 
            this.x - otherVector.x,
            this.y - otherVector.y,
            this.z - otherVector.z,
            this.w - otherVector.w
        )
    }

        
    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     * 
     * @returns {Vector4} Copy of this vector normalised.
     */
    normalised(){

        let magnitude = this.getMagnitude();
        return new Vector4( 
            this.x / magnitude,
            this.y / magnitude,
            this.z / magnitude,
            this.w / magnitude
        )
    }

    /**
     * Scales this vector by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector by.
     * @returns {Vector4} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        return new Vector4(
            this.x * scaleFactor,
            this.y * scaleFactor,
            this.z * scaleFactor,
            this.w * scaleFactor
        )
    }

    /**
     * Scales this vector to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale this vector to.
     * @returns {Vector4} Scaled copy of this vector.
     */
    scaledTo(scaleFactor ){

        const magnitude = this.magnitude();

        return new Vector4(
            this.x / magnitude * scaleFactor,
            this.y / magnitude * scaleFactor,
            this.z / magnitude * scaleFactor,
            this.w / magnitude * scaleFactor
        )   
    }

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


