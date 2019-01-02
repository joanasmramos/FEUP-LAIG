class Game {
    /**
     * Constructor
     * @param {Scene} scene 
     * @param {Board dimensions} boardDimensions 
     */
    constructor(scene, boardDimensions) {
        this.scene = scene;
        this.boardDimensions = boardDimensions;
        this.player = 1;
        this.numberOfPieces = (boardDimensions * boardDimensions + 1) / 2;

        this.board = new MyBoard(this.scene, boardDimensions);
        this.orangePiece = new MyPiece(this.scene, "orange");
        this.brownPiece = new MyPiece(this.scene, "brown");

    }

    /**
     * Displays board
     */
    displayBoard() {
        if (this.board != null) {
            this.scene.pushMatrix();
            this.scene.translate(this.boardDimensions/2, 0.05, this.boardDimensions/2);
            this.board.display();
            this.scene.popMatrix();
        }
    }

    /**
     * Displays pieces
     */
    displayPieces() {
        let row = 0;

        for(let i=0; i<this.numberOfPieces; i++) {
            let column = i%2; // par -> esquerda, ímpar -> direita, acréscimo em x por coluna
            let level = Math.floor(i/6); 
            level *= 0.27; // acréscimo em y por cada nível
            
            if(i != 0 && column == 0) {
                row += 0.9; // acréscimo em z por cada linha
                if(row > 2) {
                    row = 0;
                }
            }

            this.scene.pushMatrix();
            this.scene.translate(-2.5 + column, level, 1.1 + row);
            this.orangePiece.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(1.55 + row, level, -1.5 - column);
            this.brownPiece.display();
            this.scene.popMatrix();
        }
    }

    display() {
        this.displayBoard();
        this.displayPieces();
    }
}