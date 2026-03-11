// Matrix functions

/**
 * Creates a matrix full of 0's 
 * 
 * @param {Number} rows Row count
 * @param {Number} cols Column Count
 * @returns {Matrix} Empty Matrix 
 */
export function createEmptyMatrix( rows, cols ){

    let matrixList = [];
    for ( let r = 0; r < rows; r++ ){

        matrixList[r] = [];

        for (let c = 0; c < cols; c++){

            matrixList[r][c] = 0
        }
    }

    return new Matrix( matrixList)
}


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
     * @param {Matrix} otherMatrix Matrix to sub
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
     * @param {Matrix} otherMatrix Matrix to sub.
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


