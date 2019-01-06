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
        
        this.client = new MyClient();
        this.board = new MyBoard(this.scene, boardDimensions, this);
        this.orangePiece = new MyPiece(this.scene, "orange"); // for the piece holders
        this.brownPiece = new MyPiece(this.scene, "brown"); // for the piece holders
        this.boardPieces = new Array();
        this.directionPiece = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
        this.started = false;

        this.setupProlog();
    }

    /**
     * Gets initial board form prolog and asserts board dimensions
     */
    setupProlog() {
        let this_t = this;
        
        this.client.getPrologRequest("create_empty_board(" + JSON.stringify(this.boardDimensions) + ")", function(data) {
            this_t.board.internalBoard = JSON.parse(data.target.response);
            this_t.board.boardSequency.push(this_t.board.internalBoard);
        }, function(data){});

        this.client.getPrologRequest("assert_dimensions(" + JSON.stringify(this.boardDimensions) + ")", function(data){}, function(data){});

        //this.client.getPrologRequest("quit", function(data) {}, function(data) {});
    }

    /**
     * Verifies if a move is valid, through prolog
     * @param {Move} move 
     * @param {Previous move} oldMove 
     * @param {Board's internal representation} internalBoard 
     */
    validateMove(move, oldMove, internalBoard) {
        let this_t = this;

        if(oldMove[0] == null) {
            oldMove = 1; // there is no old move, this is the first move
        }
        // move(Move, OldMove, PlayerNumber, BoardNumbers)
        this.client.getPrologRequest("move(" + JSON.stringify(move) + "," + JSON.stringify(oldMove) + "," +
                                    JSON.stringify(this_t.player) + "," + JSON.stringify(internalBoard) + ")", 
            function(data){
                let response = JSON.parse(data.target.response);
                let valid = response[0];
                if(valid) {
                    this_t.board.boardSequency.push(internalBoard);
                    this_t.board.internalBoard = response[1];
                    this_t.board.validCell = true;
                    this_t.setPiece(move);
                    this_t.changeTurns(move);
                } else {
                    this_t.board.validCell = false;
                }
                
            }, function(data){});
    }

    /**
     * Adds piece to board according to the move
     * @param {Move} move 
     */
    setPiece(move) {
        if(this.player) { // orange
            this.numberOfOrangePieces--;
        }
        else { // brown
            this.numberOfBrownPieces--;
        }
        let row = move[0], column = move[1], direction = move[2];
        this.boardPieces.push([this.player, row, column, direction]);
    }

    /**
     * Undo last move
     */
    undo() {
        if(this.started){
            
            this.board.boardSequency.pop();
            this.board.internalBoard = this.board.boardSequency[this.board.boardSequency.length - 1];
            this.boardPieces.pop();
            let oldmove = this.boardPieces[this.boardPieces.length - 1];
            if(this.boardPieces.length == 0) {
                oldmove = [null,null,null,null];
            }
            this.changeTurns([oldmove[1], oldmove[2], oldmove[3]]);
            this.board.oldMove = [oldmove[1],oldmove[2],oldmove[3]]; 
            this.board.validCell = null;
            this.board.pickedCell = null;
            
        }
    }

    /**
     * Changes turns
     * @param {Move} move 
     */
    changeTurns(move) {
        this.board.validCell = null;
        this.board.pickedCell = null;
        this.board.oldMove = move;
        this.board.pickedMove = [null, null, null];
        this.nextTurn = true;
        this.player = (this.player)? 0 : 1;
    }

    /**
     * Initializes values for the game to start
     */
    startGame(){
        this.player = 0; // brown
        this.scene.camera = this.scene.cameraBrown;
        this.board.pickable = true;
        this.started = true;
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

    /**
     * Displays pieces that are in the board
     */
    displayBoardPieces() {
        let playerIndex = 0, rowIndex = 1, columnIndex = 2, directionIndex = 3;
        let angle = [Math.PI/2, 0, Math.PI/2/2, -Math.PI/2/2];

        for(let i=0; i<this.boardPieces.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0.5 + this.boardPieces[i][columnIndex] - 1, 0, 0.5 + this.boardPieces[i][rowIndex] - 1);
            if(this.boardPieces[i][playerIndex]) { // orange
                this.orangePiece.display();
            }
            else { // brown
                this.brownPiece.display();
            }
            if(i==(this.boardPieces.length - 1)) {
                this.scene.translate(0, 0.26, 0);
                this.scene.rotate(angle[this.boardPieces[i][directionIndex] - 1], 0, 1, 0);
                this.scene.rotate(-Math.PI/2, 1, 0, 0);
                this.scene.scale(0.7, 0.2, 1);
                this.directionPiece.display();
            }
            this.scene.popMatrix();

        }

    }

    /**
     * Displays whole game
     */
    display() {
        this.displayBoard();
        this.displayStationaryPieces();
        this.displayBoardPieces();
        if(this.board.choosingDirection) {
            this.board.displayDirections();
        }
    }
}