/**
 * Class Piece
 * Creates and draws a primitive of Coffee player piece given the parameters.
 */
class MyPiece extends CGFobject {
    constructor(scene, type) {
        super(scene);

        this.type = type;
        this.animation = null;
        this.onBoard = false;
        this.row = null;
        this.column = null;

        this.appearance = new CGFappearance(this.scene);
        this.appearance.setAmbient(0.1, 0.1, 0.1, 1);
        this.appearance.setDiffuse(0.6, 0.6, 0.6, 1);
        this.appearance.setSpecular(0.9, 0.9, 0.9, 1);
        this.appearance.setShininess(100);

        if(this.type == "brown") {
            this.appearance.loadTexture("./scenes/images/brown.jpg");
        }
        else if (this.type == "orange") {
            this.appearance.loadTexture("./scenes/images/orange.jpg");
        }

        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 1, 50, 20);
        this.initBuffers();
    };

    display(){
        this.scene.pushMatrix();
            this.appearance.apply();
            if(this.onBoard) {
                if(this.animation != null) {
                    this.animation.apply();
                }
                else { 
                    this.scene.translate(0.5 + this.column - 1, 0, 0.5 + this.row - 1);
                }
            }
            if(this.animation != null && this.type == "brown") {
                this.scene.translate(1.55, 0, -2.5);
            }
            else if (this.animation != null && this.type == "orange") {
                this.scene.translate(1.55, 0, 6.5);
            }
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(0.8, 0.8, 0.25);
            this.piece.display();
        this.scene.popMatrix();

        this.scene.defaultAppearance.apply();
    };
}