class Game {
    /**
     * Constructor
     * @param {Scene} scene 
     * @param {Board dimensions} boardDimensions 
     */
    constructor(scene, boardDimensions) {
        this.scene = scene;
        this.boardDimensions = boardDimensions;
        this.numberOfOrangePieces = (boardDimensions * boardDimensions + 1) / 2;
        this.numberOfBrownPieces = this.numberOfOrangePieces;

        this.board = new MyBoard(this.scene, boardDimensions);
        this.orangePiece = new MyPiece(this.scene, "orange");
        this.brownPiece = new MyPiece(this.scene, "brown");
        this.client = new MyClient();

        this.setupProlog();
    }

    /**
     * Gets initial board form prolog and asserts board dimensions
     */
    setupProlog() {
        let this_t = this;
        
        //currently working on this
        this.client.getPrologRequest("create_empty_board(" + JSON.stringify(this.boardDimensions) + ")", function(data) {
            this_t.board.internalBoard = JSON.parse(data.target.response);
        }, function(data){});

        this.client.getPrologRequest("assert_dimensions(" + JSON.stringify(this.boardDimensions) + ")", function(data){}, function(data){});

        // this.client.getPrologRequest("quit", function(data) {}, function(data) {});
    }

    /**
     * Called after countdown
     */
    startGame(){
        this.player = 0; // brown
        this.scene.camera = this.scene.cameraBrown;

        console.log("Brown player's turn");
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
     * Displays pieces that are in the piece holders
     */
    displayStationaryPieces() {
        let row = 0;

        let numberOfPieces = (this.numberOfOrangePieces>this.numberOfBrownPieces)? this.numberOfOrangePieces : this.numberOfBrownPieces;

        for(let i=0; i<numberOfPieces; i++) {
            let column = i%2; // par -> esquerda, ímpar -> direita, acréscimo em x por coluna
            let level = Math.floor(i/6); 
            level *= 0.27; // acréscimo em y por cada nível
            
            if(i != 0 && column == 0) {
                row += 0.9; // acréscimo em z por cada linha
                if(row > 2) {
                    row = 0;
                }
            }

            if(i < this.numberOfOrangePieces) {
                this.scene.pushMatrix();
                this.scene.translate(1.55 + row, level, 6.5 + column);
                this.orangePiece.display();
                this.scene.popMatrix();
            }

            if(i < this.numberOfBrownPieces) {
                this.scene.pushMatrix();
                this.scene.translate(1.55 + row, level, -1.5 - column);
                this.brownPiece.display();
                this.scene.popMatrix();
            }
        }
    }

    display() {
        this.displayBoard();
        this.displayStationaryPieces();
        if(this.board.choosingDirection) {
            this.board.displayDirections();
        }
    }
}