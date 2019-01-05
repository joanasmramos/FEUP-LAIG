/**
 * A board
 */
class MyBoard extends CGFobject {

    /**
     * Constructor
     * @param {Scene} scene 
     * @param {Board Dimensions} dimensions 
     */
    constructor(scene, dimensions, game){
        super(scene);

        this.game = game;
        this.dimensions = dimensions;
        this.pickedCell = null;
        this.validCell = null;
        this.choosingDirection = false;
        this.cells = new Array();
        this.internalBoard = new Array();
        this.boardSequency = new Array();
        this.pickedMove = [null,null,null];
        this.oldMove = [null,null,null];
        this.directions = new Array();
        this.setupMaterials();

        for(let i=0; i<dimensions*dimensions; i++) {
            this.cells.push(new Plane(scene, 20, 20));
        }
        
        for(let i = 0; i < 4; i++) {
            this.directions.push(new Plane(scene, 20, 20));
        }

    }

    /**
     * Creates cell materials
     */
    setupMaterials(){
        this.cellMaterial = new CGFappearance(this.scene);
        this.cellMaterial.loadTexture("scenes/images/cell.png");
        this.cellMaterial.setShininess(0);
        this.cellMaterial.setAmbient(0, 0, 0, 1);
        this.cellMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.cellMaterial.setSpecular(0, 0, 0, 1);

        this.validMove = new CGFappearance(this.scene);
        this.validMove.loadTexture("scenes/images/cell_valid.png");
        this.validMove.setShininess(100);
        this.validMove.setAmbient(0, 0, 0, 1);
        this.validMove.setDiffuse(0.6, 0.9, 0.6, 1);
        this.validMove.setSpecular(0, 0, 0, 1);

        this.invalidMove = new CGFappearance(this.scene);
        this.invalidMove.loadTexture("scenes/images/cell_invalid.png");
        this.invalidMove.setShininess(100);
        this.invalidMove.setAmbient(0, 0, 0, 1);
        this.invalidMove.setDiffuse(0.6, 0.9, 0.6, 1);
        this.invalidMove.setSpecular(0, 0, 0, 1);

        this.awaitingCell = new CGFappearance(this.scene);
        this.awaitingCell.loadTexture("scenes/images/cell_awaiting.png");
        this.awaitingCell.setShininess(100);
        this.awaitingCell.setAmbient(0, 0, 0, 1);
        this.awaitingCell.setDiffuse(0.6, 0.9, 0.6, 1);
        this.awaitingCell.setSpecular(0, 0, 0, 1);

    }

    /**
     * Log picking
     */
    logPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i=0; i< this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                        let customId = this.scene.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        if(customId <= this.dimensions * this.dimensions) {
                            this.pickedCell = customId;
                            this.pickCell(customId);
                        } else if(customId > this.dimensions * this.dimensions) {
                            this.pickDirection(customId);
                        }                        
                    }
                }
                this.scene.pickResults.splice(0,this.scene.pickResults.length);
            }		
        }
    }

    pickCell(id){
        let rowIndex = 0, columnIndex = 1;
        let row = Math.ceil(id/this.dimensions);
        let column;

        if(row > 1) {
            column = id - ((row - 1) * this.dimensions + 1) + 1;
        }
        else {
            column = id;
        }

        this.pickedMove[rowIndex] = row;
        this.pickedMove[columnIndex] = column;
        this.choosingDirection = true;
    }

    pickDirection(id){
        let directionIndex = 2;
        let direction = id - this.dimensions*this.dimensions;
        this.pickedMove[directionIndex] = direction;
        this.game.validateMove(this.pickedMove, this.oldMove, this.internalBoard);
    }

    displayDirections() {
        this.scene.clearPickRegistration();
        let angle = [0, Math.PI/2, -Math.PI/2/2, Math.PI/2/2]

        let i=0;
        for(let row=0; row<2; row++) {
            for(let column=0; column<2; column++) {
                if((i+1) == this.pickedMove[2]) {
                    this.awaitingCell.apply();
                    if(this.validCell === true) {
                        this.validMove.apply();
                    }
                    else if(this.validCell === false) {
                        this.invalidMove.apply();
                    } else {
                        this.awaitingCell.apply();
                    }
                }
                else {
                    this.scene.defaultAppearance.apply();
                }
                this.scene.pushMatrix();
                this.scene.translate(6 + column*1.5, 0.1, 3 - row*1.5);
                this.scene.rotate(angle[i], 0, 1, 0);
                this.scene.scale(0.5, 1, 1.2);
                this.scene.registerForPick(this.dimensions*this.dimensions + i + 1, this.directions[i]);
                this.directions[i].display();
                this.scene.popMatrix();
                i++;
            }
        }

        this.scene.clearPickRegistration();
    }

    display() {
        this.logPicking();
        this.scene.clearPickRegistration();

        this.scene.pushMatrix();

        // translate to origin
        this.scene.translate(-this.dimensions/2, 0, -this.dimensions/2);

        let i=1;
        for(let row=0; row<this.dimensions; row++) { // rows (0..dimensions-1)
            for(let column=0; column<this.dimensions; column++) { // columns (0..dimensions-1)
                this.scene.pushMatrix();
                    this.scene.translate(column, 0, row);
                    this.scene.translate(0.5, 0.25, 0.5);
                    this.scene.registerForPick(i, this.cells[i-1]);
                    if(this.scene.pickMode) {
                        this.cells[i-1].display();
                    }
                    i++;
                this.scene.popMatrix();
            }
        }

        this.scene.clearPickRegistration();

        i=1;
        for(let row=0; row<this.dimensions; row++) { // rows (0..dimensions-1)
            for(let column=0; column<this.dimensions; column++) { // columns (0..dimensions-1)
                this.scene.pushMatrix();
                    if(i == this.pickedCell) {
                        if(this.validCell === true) {
                            this.validMove.apply();
                        }
                        else if(this.validCell === false) {
                            this.invalidMove.apply();
                        } else {
                            this.awaitingCell.apply();
                        }
                    }
                    else {
                        this.cellMaterial.apply();
                    }
                    this.scene.translate(column, 0, row);
                    this.scene.translate(0.5, 0, 0.5);
                    this.cells[i-1].display();
                    i++;
                this.scene.popMatrix();
            }
        }

        this.scene.popMatrix();
    }

}