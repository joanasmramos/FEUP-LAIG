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

        for(let i=0; i<dimensions*dimensions; i++) {
            this.cells.push(new Plane(scene, 5, 5));
        }
    }

    display() {

        this.scene.pushMatrix();

        // translate to origin
        this.scene.translate(-this.dimensions/2, 0, -this.dimensions/2);

        let i=0;
        for(let row=0; row<this.dimensions; row++) { // rows (0..dimensions-1)
            for(let column=0; column<this.dimensions; column++) { // columns (0..dimensions-1)
                this.scene.pushMatrix();
                    this.cellMaterial.apply();
                    this.scene.translate(column, 0, row);
                    this.scene.translate(0.5, 0, 0.5);
                    this.cells[i++].display();
                this.scene.popMatrix();
            }
        }

        this.scene.popMatrix();
    }

}