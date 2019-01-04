/**
 * A board
 */
class MyBoard extends CGFobject {

    /**
     * Constructor
     * @param {Scene} scene 
     * @param {Board Dimensions} dimensions 
     */
    constructor(scene, dimensions){
        super(scene);

        this.dimensions = dimensions;
        this.pickedOne = null;
        this.cells = new Array();
        this.internalBoard = new Array();
        this.pickedMove = new Array(3);
        this.setupMaterials();

        for(let i=0; i<dimensions*dimensions; i++) {
            this.cells.push(new Plane(scene, 5, 5));
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

        this.validCell = new CGFappearance(this.scene);
        this.validCell.loadTexture("scenes/images/cell_valid.png");
        this.validCell.setShininess(100);
        this.validCell.setAmbient(0, 0, 0, 1);
        this.validCell.setDiffuse(0.6, 0.9, 0.6, 1);
        this.validCell.setSpecular(0, 0, 0, 1);

        this.invalidCell = new CGFappearance(this.scene);
        this.invalidCell.loadTexture("scenes/images/cell_invalid.png");
        this.invalidCell.setShininess(100);
        this.invalidCell.setAmbient(0, 0, 0, 1);
        this.invalidCell.setDiffuse(0.6, 0.9, 0.6, 1);
        this.invalidCell.setSpecular(0, 0, 0, 1);

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
                        this.pickedOne = customId;
                        this.pickedCell(customId);
                    }
                }
                this.scene.pickResults.splice(0,this.scene.pickResults.length);
            }		
        }
    }

    pickedCell(id){
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
                    if(i == this.pickedOne) {
                        this.awaitingCell.apply();
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