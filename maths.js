
// Classes

export class Matrix{

    // Constructing / Creating

    /**
     * Creates a matrix from a list of rows.
     * List should contain 1 or more (nested) lists as the rows,
     * 
     * -------------
     * 1 X 1 Matrix:
     * 
     * [
     *  [ Col1 ]
     * ]
     * 
     * e.g
     * 
     * [ [ 1 ] ]
     * 
     * -------------
     * 3 X 2 Matrix:
     * 
     * [
     *  [ Col1, Col2 ],
     * 
     *  [ Col1, Col2 ],
     * 
     *  [ Col1, Col2 ]
     * ]
     * 
     * e.g
     * 
     * [ 
     *   [ 1, 4, 7 ],
     * 
     *   [ 2, 5, 8 ],
     * 
     *   [ 3, 6, 9 ] 
     * ]
     * 
     * -------------
     * @param {List} matrixAsList 
     */
    constructor( matrixAsList ){

        this.matrix = matrixAsList;

        this.checkMatrix();

        this.rows = this.matrix.length;
        this.columns = this.matrix[0].length; // Assume all the same since it was checked 
    }

    /** 
     * Checks if the matrix was written correctly:
     * 
     * * Each row has the same number of columns
     */
    checkMatrix(){  

        // console.log(`Matrix list: ${this.repr()}`)

        let rows = this.matrix.length;
        let prevCols = this.matrix[0].length;

        // 1 X 1 matrix - ( one ) column, no other to compare
        if (rows === 1){

            if ( this.matrix[0].constructor === Array ){

                return;
            }
        }
        
        for (let r = 0; r < rows; r++ ){

            // Checks if each item is a list
            if ( this.matrix[ r ].constructor != Array ){

                throw new Error(`Row ${this.matrix[ r ]} at matrix index: ${r}, is type ${ typeof this.matrix[ r ]}, not an ${Array} type.`);
            }

            let rowCount = this.matrix[ r ].length;

            // Checks the first col with the frist col, but should be fine
            if ( rowCount != prevCols ){

                throw new Error(`Row ${this.matrix[ r ]} at matrix index: ${r}, has differing column counts: previous count ${prevCols}, index col count ${rowCount}.`); 
            }

            // Dont need to updated prevCols, since every size *should* be the same, otherwise it would throw an error
        }
    }

    /**
     * Logs the matrix to the console.
     */
    repr(){

        console.log("Matrix: ");
        this.matrix.forEach(element => { console.log( element ) });

    }

    /**
     * Returns a copy of this matrix
     */
    copy(){

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList.add( [] );

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = this.getValue(r, c)
            }
        }

        return new Matrix( matrixList );

    }

    // Variables

    /**
     * Returns the value at the index [ Row ][ Col ].
     * @param {Number} row Row for the matrix.
     * @param {Number} col Column for the matrix.
     * @returns {Number} Value at index.
     */
    getValue(row, col){

        return this.matrix[ row ][ col ];
    }

    /**
     * Returns the value at the index [ Row ][ Col ].
     * @param {Number} row Row for the matrix.
     * @param {Number} col Column for the matrix.
     * @param {Number} value Number for that index.
     */
    setValue(row, col, value){

        if (value.constructor != Number){

            throw new Error(`Value: ${value}, to set is type: ${typeof value}, not a ${Number}`);
        }

        this.matrix[ row ][ col ] = value;
    }

    // Calculations

    /**
     * Checks if this and the inputted matrix have the rows, and column count. 
     * @param {Matrix} otherMatrix 
     * @returns {boolean} 
     */
    isMatrixSameSize(otherMatrix ){

        if ( this.rows != otherMatrix.rows || this.columns != otherMatrix.columns ){

            throw new Error(`Matricies have differing sizes: thisRow: ${this.rows}, otherRows: ${otherMatrix.rows} | thisCols: ${this.columns}, otherCols: ${otherMatrix.columns}`)
        }

        return true;
    }

    /**
     * Adds this and the inputted matrices togethor.
     * Matricies need to be the same size.
     * * This = This + Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to add
     */
    add( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );
        
        for ( let r = 0; r < this.rows; r++ ){

            for (let c = 0; c < this.columns; c++){

                this.matrix[r][c] = this.getValue(r, c) + otherMatrix.getValue(r, c);
            }
        }

    }

    /**
     * Substracts this and the inputted matrices togethor.
     * Matricies need to be the same size.
     * * This = This - Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to add
     */
    sub( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );
        
        for ( let r = 0; r < this.rows; r++ ){

            for (let c = 0; c < this.columns; c++){

                this.matrix[r][c] = this.getValue(r, c) - otherMatrix.getValue(r, c);
            }
        }

    }

    /**
     * Does a matrix multiplication on this and the other matrix; and sets it
     * to this matrix:
     * 
     * * This = A
     * * Other = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * A rows must equal B columns,
     * 
     * Multiply matrix size is A rows x B cols. 
     * 
     * @param {Matrix} otherMatrix 
     */
    multiply( otherMatrix ){

        // This = A
        // Other = B
        
        if ( this.columns != otherMatrix.rows ){

            throw new Error(`Cannot multiply matricies have differing sizes: thisRow: ${this.rows}, otherCols: ${otherMatrix.columns}`);
        }

        let multiplyMatrix = createEmptyMatrix( this.rows, otherMatrix.columns );
        multiplyMatrix.repr();

        // Repeats for each row in A
        for (let aRowIndex = 0; aRowIndex < this.rows; aRowIndex++ ){

            // Repeats for each column in B
            for (let bColIndex = 0; bColIndex < otherMatrix.columns; bColIndex++ ){

                let sum = 0;

                // Goes down B's rows, and across A's Columns
                // Finds the sum of: A Cols and B Rows multiplied
                for (let bRowIndex = 0; bRowIndex < otherMatrix.rows; bRowIndex++){

                    let A = this.getValue(aRowIndex, bRowIndex);
                    let B = otherMatrix.getValue(bRowIndex, bColIndex);

                    sum += A * B;
                }

                multiplyMatrix.setValue(aRowIndex, bColIndex, sum ); 
            }

        }

        this.matrix = multiplyMatrix.matrix;
        this.rows = multiplyMatrix.rows;
        this.columns = multiplyMatrix.columns;
    }

    // Return Calculations

    /**
     * Returns this and the inputted matrices added togethor.
     * Matricies need to be the same size.
     * * This = This + Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to add
     * @return {Matrix} Copy of added matrices
     */
    added( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList[r] = [];

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = (this.getValue(r, c) + otherMatrix.getValue(r, c));
            }
        }

        return new Matrix( matrixList );
    }

    /**
     * Returns this and the inputted matrices subtracted togethor.
     * Matricies need to be the same size.
     * * This = This - Inputted.  
     * 
     * @param {Matrix} otherMatrix Matrix to add.
     * @return {Matrix} Copy of subtracted matrices.
     */
    subbed( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList[r] = [];

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = (this.getValue(r, c) - otherMatrix.getValue(r, c));
            }
        }

        return new Matrix( matrixList );
    }

    /**
     * Returns the matrix multiplication of this and the other matrix:
     * * This = A,
     * * Other = B,
     * * This = Matrix multiplication of A x B.
     *  
     * 
     * A rows must equal B columns,
     * 
     * Multiply matrix size is A rows x B cols. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Matrix} Return of A x B.
     */
    multiplied( otherMatrix ){

        // This = A
        // Other = B
        
        if ( this.columns != otherMatrix.rows ){

            throw new Error(`Cannot multiply matricies have differing sizes: thisRow: ${this.rows}, otherCols: ${otherMatrix.columns}`);
        }

        let multiplyMatrix = createEmptyMatrix( this.rows, otherMatrix.columns );
        multiplyMatrix.repr();

        // Repeats for each row in A
        for (let aRowIndex = 0; aRowIndex < this.rows; aRowIndex++ ){

            // Repeats for each column in B
            for (let bColIndex = 0; bColIndex < otherMatrix.columns; bColIndex++ ){

                let sum = 0;

                // Goes down B's rows
                // Find the sum of A Cols and B Rows multiplied
                for (let bRowIndex = 0; bRowIndex < otherMatrix.rows; bRowIndex++){

                    let A = this.getValue(aRowIndex, bRowIndex);
                    let B = otherMatrix.getValue(bRowIndex, bColIndex);

                    sum += A * B;
                }

                multiplyMatrix.setValue(aRowIndex, bColIndex, sum ); 
            }

        }

        return multiplyMatrix;
    }

}

// Points

export class Point2{
    // A 2D point class

    constructor(x, y){

        this.x = x;
        this.y = y;

    }

    /**
     * Logs the Point2 to the console.
     */
    repr(){

        console.log(`Point2: ${this.x, this.y} `);
    }
    
    
    /**
     * Returns a copy of this point.
     * @returns {Point2} Copy of this point
     */
    copy(){

        return new Point2( this.x, this.y );
    }


    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector2} Vector from this to otherPoint.
     */
    vectorToPoint(otherPoint ){
        
        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;

        return new Vector2(x, y);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector2} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;

        return new Vector2(x, y);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector2} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
    }


    // Calculations

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets it to this point:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y] ]);
        pointMatrix.multiply(otherMatrix);

        this.x = pointMatrix[0][0];
        this.y = pointMatrix[1][0];
    }

    // Return Calculations

    /**
     * Returns a copy of this point translated 
     * @param {Vector2} translationVector Vector to translate the point by
     * @returns {Point2} Translated point
     */
    translated(translationVector ){

        let newPoint = new Point2(this.x, this.y )
        newPoint.translate(translationVector )

        return newPoint;
    }

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets returns it:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Point2}
     */
    matrixMultiplied( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y] ]);
        pointMatrix.multiply(otherMatrix);

        const x = pointMatrix[0][0];
        const y = pointMatrix[1][0];

        return new Point2(x, y, z);
    }


}

export class Point3{
    // A 3D point class

    constructor(x, y, z){

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Logs the Point3 to the console.
     */
    repr(){

        console.log(`Point3: ${this.x, this.y, this.z} `);
    }

    /**
     * Returns a copy of this point.
     * @returns {Point3} Copy of this point
     */
    copy(){

        return new Point3( this.x, this.y, this.z );
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector3} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;
        let z = otherPoint.z - this.z;

        return new Vector3(x, y, z);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector3} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;
        let z = this.z - otherPoint.z;

        return new Vector3(x, y, z);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector3} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
        this.z = this.z + translationVector.z;

    }

    // Calculations

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets it to this point:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y], [this.z] ]);
        pointMatrix.multiply(otherMatrix);

        this.x = pointMatrix[0][0];
        this.y = pointMatrix[1][0];
        this.z = pointMatrix[2][0];
    }

    // Return Calculations

    /**
     * Returns a copy of this point translated 
     * @param {Vector3} translationVector Vector to translate the point by
     * @returns {Point3} Translated point
     */
    translated(translationVector ){

        let newPoint = new Point3(this.x, this.y, this.z );
        newPoint.translate(translationVector );

        return newPoint;
    }

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets returns it:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Point3}
     */
    matrixMultiplied( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y], [this.z] ]);
        pointMatrix.multiply(otherMatrix);

        const x = pointMatrix[0][0];
        const y = pointMatrix[1][0];
        const z = pointMatrix[2][0];

        return new Point3(x, y, z);
    }

}

export class Point4{
        // A 4D point class

    constructor(x, y, z, w){

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Logs the Point3 to the console.
     */
    repr(){

        console.log(`Point4: ${this.x, this.y, this.z, this.w} `);
    }

    /**
     * Returns a copy of this point.
     * @returns {Point4} Copy of this point
     */
    copy(){

        return new Point4( this.x, this.y, this.z, this.w );
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector4} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        const x = otherPoint.x - this.x;
        const y = otherPoint.y - this.y;
        const z = otherPoint.z - this.z;
        const w = otherPoint.w - this.w;

        return new Vector4(x, y, z);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector4} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        const x = this.x - otherPoint.x;
        const y = this.y - otherPoint.y;
        const z = this.z - otherPoint.z;
        const w = this.w - otherPoint.w;

        return new Vector4(x, y, z, w);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector4} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
        this.z = this.z + translationVector.z;
        this.w = this.w + translationVector.w;

    }

    // Calculations

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets it to this point:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        pointMatrix.multiply(otherMatrix);

        this.x = pointMatrix[0][0];
        this.y = pointMatrix[1][0];
        this.z = pointMatrix[2][0];
        this.w = pointMatrix[3][0];
    }

    // Return Calculations

    /**
     * Returns a copy of this point translated 
     * @param {Vector4} translationVector Vector to translate the point by
     * @returns {Point4} Translated point
     */
    translated(translationVector ){

        let newPoint = new Point4(this.x, this.y, this.z, this.w );
        newPoint.translate(translationVector );

        return newPoint;
    }

    /**
     * Does a matrix multiplication on this point and the other matrix; and 
     * sets returns it:
     * 
     * * Point = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Point dimension must equal B columns,
     * 
     * Multiply matrix size is: Point dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Point4}
     */
    matrixMultiplied( otherMatrix ){

        pointMatrix = new Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        pointMatrix.multiply(otherMatrix);

        const x = pointMatrix[0][0];
        const y = pointMatrix[1][0];
        const z = pointMatrix[2][0];
        const w = pointMatrix[3][0];

        return new Point4(x, y, z, w);
    }
}

// Vector

export class Vector2{
    // A 2D vector class

    /**
     * Creates a 2d vector with X anf y.
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     */
    constructor (x, y ){

        this.x = x;
        this.y = y;
    }

    /**
     * Logs the Vector2D to the console.
     */
    repr(){

        console.log(`Vector2: ${this.x, this.y } `);
    }

    /**
     * Returns a copy of this Vector.
     * @returns {Vector2} Copy of this vector.
     */
    copy(){

        return new Vector2( this.x, this.y );
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

        return (this.y / this.x)
    }


    // Calculations

    /**
     * Adds the inputted vector to this vector:
     * this = this + otherVector
     * @param {Vector2} otherVector Vector to add to this vector.
     */
    addition(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
    }

    /**
     * Subtracts the inputted vector from this vector:
     * this = this - otherVector
     * @param {Vector2} otherVector Vector to subtract to this vector.
     */
    subtraction(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
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

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
    }

    /**
     * Rotates this vector clock-wise by the inputted rotation.
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    rotate(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        this.x = x
        this.y = y
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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
    }

    // Return Calculation

    /**
     * Adds the inputted vector to this vector and returns it.
     * 
     * @param {Vector2} otherVector Vector to add to this vector.
     * @returns {Vector2} Returns sum of this + inputted.
     */
    added(otherVector ){

        const x = this.x + otherVector.x;
        const y = this.y + otherVector.y;

        return new Vector2(x, y);
    }

    /**
     * Subtracts the inputted vector from this vector and returns it.
     * 
     * @param {Vector2} otherVector Vector to subtract to this vector.
     * @returns {Vector2} Returns sum of this - inputted.
     */
    subbed(otherVector ){

        const x = this.x - otherVector.x;
        const y = this.y - otherVector.y;

        return new Vector2(x, y);
    }


    /**
     * Returns a normalised copy of this vector, with magnitude 1.
     * @returns {Vector2} Normalised copy of this vector.
     */
    normalised(){

        const magnitude = this.getMagnitude();
        const x = this.x / magnitude;
        const y = this.y / magnitude;

        return new Vector2(x, y);
    }

    /**
     * Returns a scaled copy this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {Vector2} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        const copyVector = this.normalised();
        copyVector.scale(scaleFactor);

        return copyVector;
    }

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector2} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        const x = this.x * otherVector.x
        const y = this.y * otherVector.y

        return x + y
    }


    /**
     * Returns a copy of this vector rotated clock-wise by the inputted rotation.
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector2} Copy og this vector rotated.
     */
    rotated(radianRotation ){

        const x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        const y = (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        return new Vector2(x, y);
    }

    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * returns it:
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
     */
    matrixMultiplied( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y] ]);
        vectorMatrix.multiply(otherMatrix);

        const x = vectorMatrix[0][0];
        const y = vectorMatrix[1][0];

        return new Vector2(x, y);
    }

}

export class Vector3{
    // A 3D vector class

    /**
     * Creates a 3d vector with x, y, z.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     */
    constructor (x, y, z ){

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Logs the Vector3 to the console.
     */
    repr(){

        console.log(`Vector3: ${this.x, this.y, this.z} `);
    }

    /**
     * Returns a copy of this Vector.
     * @returns {Vector3} Copy of this Vector.
     */
    copy(){

        return new Vector3( this.x, this.y, this.z );
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) );
    }

    /**
     * Gets the euler rotation for the X, Y, Z angles, measured in radians 
     * @returns {Array<Number>} [ X_Radian, Y_Radian, Z_Radian ]
     */
    getOrientation(){

        // Y and Z are swapped in the calculation, as it states Z as up & down
        // So Y is Gamma, and Z is Beta

        let denominator = this.getMagnitude();

        let alpha = Math.acos( this.x / denominator );
        let beta = Math.acos( this.z / denominator );
        let gamma = Math.acos( this.y / denominator );
      
        return [alpha, beta, gamma ];
    }

    // Vector Calculations

    /**
     * Adds the inputted vector to this vector:
     * this = this + otherVector
     * @param {Vector3} otherVector Vector to add to this vector.
     */
    add(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
        this.z = this.z + otherVector.z;
    }

    /**
     * Subtracts the inputted vector from this vector:
     * this = this - otherVector
     * @param {Vector3} otherVector Vector to subtract to this vector.
     */
    sub(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
        this.z = this.z - otherVector.z;
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
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y], [this.z] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
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

    // Return Calculation

    /**
     * Adds the inputted vector to this vector and returns it.
     * 
     * @param {Vector3} otherVector Vector to add to this vector.
     * @returns {Vector3} Returns sum of this + inputted.
     */
    added(otherVector ){

        const x = this.x + otherVector.x;
        const y = this.y + otherVector.y;
        const z = this.z + otherVector.z;

        return new Vector3(x, y, z);
    }

    /**
     * Subtracts the inputted vector from this vector and returns it.
     * 
     * @param {Vector3} otherVector Vector to subtract to this vector.
     * @returns {Vector3} Returns sum of this - inputted.
     */
    subbed(otherVector ){

        const x = this.x - otherVector.x;
        const y = this.y - otherVector.y;
        const z = this.z - otherVector.z;

        return new Vector3(x, y, z);
    }

    /**
     * Returns a normalised copy of this vector, with magnitude 1.
     * @returns {Vector3} Normalised copy of this vector.
     */
    normalised(){

        let magnitude = this.getMagnitude();
        let x = this.x / magnitude;
        let y = this.y / magnitude;
        let z = this.z / magnitude;

        return new Vector3(x, y, z );
    }

    /**
     * Returns a scaled copy this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {Vector3} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        let copyVector = this.normalised();
        copyVector.scale(scaleFactor);

        return copyVector;
    }

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector3} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        let x = this.x * otherVector.x;
        let y = this.y * otherVector.y;
        let z = this.z * otherVector.z;

        return x + y + z;
    }

    cross(otherVector ){

        let x = ( this.y + otherVector.z ) - ( this.z + otherVector.y );
        let y = ( this.z + otherVector.x ) - ( this.x + otherVector.z );
        let z = ( this.x + otherVector.y ) - ( this.y + otherVector.x );

        return new Vector3( x, y, z );
    }

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

        vectorMatrix = new Matrix([ [this.x], [this.y], [this.z] ]);
        vectorMatrix.multiply(otherMatrix);

        const x = vectorMatrix[0][0];
        const y = vectorMatrix[1][0];
        const z = vectorMatrix[2][0];

        return new Vector3(x, y, z );
    }

    // Return Rotation

    /**
     * Returns a copy of this vector rotated about the x-axis by the inputted roation. 
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
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    yRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) + ( this.z * Math.sin(radianRotation ));
        let z = ( this.z * Math.cos(radianRotation )) - (this.x * Math.sin(radianRotation ));

        return new Vector3(x, this.y, z);
    }


    /**
     * Returns a copy of this vector rotated about the z-axis by the inputted roation .
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    zRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.y * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        return new Vector3(x, y, this.z );
    }
}

export class Vector4{
    // A 4D vector class

    /**
     * Creates a 4d vector with x, y, z, w.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     * @param {Number} w W value for the vector.
     */
    constructor (x, y, z, w ){

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Logs the Vector4 to the console.
     */
    repr(){

        console.log(`Vector4: ${this.x, this.y, this.z, this.w} `);
    }

    /**
     * Returns a copy of this Vector.
     * @returns {Vector4} Copy of this Vector.
     */
    copy(){

        return new Vector4( this.x, this.y, this.z, this.w );
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) + (this.w ** 2) );
    }

    // Vector Calculations

    /**
     * Adds the inputted vector to this vector:
     * this = this + otherVector
     * @param {Vector4} otherVector Vector to add to this vector.
     */
    addition(otherVector ){

        this.x = this.x + otherVector.x;
        this.y = this.y + otherVector.y;
        this.z = this.z + otherVector.z;
        this.w = this.w + otherVector.w;
    }

    /**
     * Subtracts the inputted vector from this vector:
     * this = this - otherVector
     * @param {Vector4} otherVector Vector to subtract to this vector.
     */
    subtraction(otherVector ){

        this.x = this.x - otherVector.x;
        this.y = this.y - otherVector.y;
        this.z = this.z - otherVector.z;
        this.w = this.w - otherVector.w;
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
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
        this.w = this.w * scaleFactor;
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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
        this.w = vectorMatrix[3][0];
    }

    // Return Calculations
    
    /**
     * Adds the inputted vector to this vector and returns it.
     * 
     * @param {Vector4} otherVector Vector to add to this vector.
     * @returns {Vector4} Returns sum of this + inputted.
     */
    added(otherVector ){

        const x = this.x + otherVector.x;
        const y = this.y + otherVector.y;
        const z = this.z + otherVector.z;
        const w = this.w + otherVector.w;

        return new Vector4(x, y, z, w);
    }

    /**
     * Subtracts the inputted vector from this vector and returns it.
     * 
     * @param {Vector4} otherVector Vector to subtract to this vector.
     * @returns {Vector4} Returns sum of this - inputted.
     */
    subbed(otherVector ){

        const x = this.x - otherVector.x;
        const y = this.y - otherVector.y;
        const z = this.z - otherVector.z;
        const w = this.w + otherVector.w;

        return new Vector4(x, y, z, w);
    }

    /**
     * Returns a normalised copy of this vector, with magnitude 1.
     * @returns {Vector4} Normalised copy of this vector.
     */
    normalised(){

        let magnitude = this.getMagnitude();
        let x = this.x / magnitude;
        let y = this.y / magnitude;
        let z = this.z / magnitude;
        let w = this.w / magnitude;

        return new Vector4(x, y, z, w );
    }

    /**
     * Returns a scaled copy this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {Vector4} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        let copyVector = this.normalised();
        copyVector.scale(scaleFactor);

        return copyVector;
    }

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector4} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        let x = this.x * otherVector.x;
        let y = this.y * otherVector.y;
        let z = this.z * otherVector.z;
        let w = this.w * otherVector.w;

        return x + y + z + w;
    }


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
     * @returns {Vector4}
     */
    matrixMultiplied( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        vectorMatrix.multiply(otherMatrix);

        const x = vectorMatrix[0][0];
        const y = vectorMatrix[1][0];
        const z = vectorMatrix[2][0];
        const w = vectorMatrix[3][0];

        return new Vector4(x, y, z, w);
    }

}

// Shapes

export class Sphere{
    // A 3d Sphere class

    /**
     * Creates a sphere using centre-point and a radius.
     * @param {Point3} centre Centre of the sphere.
     * @param {Number} radius Radius of the sphere.
     */
    constructor( centre, radius ){

        this.centre = centre;
        this.radius = radius;
    }

    
}