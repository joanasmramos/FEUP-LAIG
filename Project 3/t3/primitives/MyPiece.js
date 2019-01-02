/**
 * Class Piece
 * Creates and draws a primitive of Coffee player piece given the parameters.
 */
class MyPiece extends CGFobject {
    constructor(scene, type) {
        super(scene);

        this.type = type;
        // this.row = row;
        // this.column = column;

        if(this.type == "brown") {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.19, 0.06, 0.06, 1);
        this.appearance.setAmbient(0, 0, 0, 1);
        this.appearance.setDiffuse(0.19, 0.06, 0.06, 1);
        this.appearance.setSpecular(0.19, 0.06, 0.06, 1);
        this.appearance.setShininess(100);
        }
        else if (this.type == "orange") {
        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(1, 0.15, 0, 1);
        this.appearance.setAmbient(0, 0, 0, 1);
        this.appearance.setDiffuse(1, 0.15, 0, 1);
        this.appearance.setSpecular(1, 0.15, 0, 1);
        this.appearance.setShininess(100);
        }

        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.25, 20, 20);
        this.initBuffers();
    };

    display(){
    this.scene.pushMatrix();
        this.scene.translate(0.5,0,0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.appearance.apply();
        this.piece.display();
    this.scene.popMatrix();
    
    };
}