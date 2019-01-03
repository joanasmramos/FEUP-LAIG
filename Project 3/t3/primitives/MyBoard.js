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
        this.cells = new Array();

        this.cellMaterial = new CGFappearance(scene);
        this.cellMaterial.loadTexture("scenes/images/cell.png");
        this.cellMaterial.setShininess(0);
        this.cellMaterial.setAmbient(0, 0, 0, 1);
        this.cellMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
        this.cellMaterial.setSpecular(0, 0, 0, 1);

        this.picked = new CGFappearance(scene);
        this.picked.loadTexture("scenes/images/cell.png");
        this.picked.setShininess(100);
        this.picked.setAmbient(0, 0, 0, 1);
        this.picked.setDiffuse(0.6, 0.9, 0.6, 1);
        this.picked.setSpecular(0, 0, 0, 1);

        for(let i=0; i<dimensions*dimensions; i++) {
            this.cells.push(new Plane(scene, 5, 5));
        }

        this.greenOne = -1;
    }

    logPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                for (let i=0; i< this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    if (obj) {
                        let customId = this.scene.pickResults[i][1];				
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        this.greenOne = customId;
                    }
                }
                this.scene.pickResults.splice(0,this.scene.pickResults.length);
            }		
        }
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
                    if(i == this.greenOne) {
                        this.picked.apply();
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