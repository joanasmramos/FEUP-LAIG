/**
 * Class DirectionalPiece
 * Creates and draws a primitive of Coffee directional piece given the parameters.
 */
class MyDirectionalPiece extends CGFobject {
    constructor(scene) {
        super(scene);
        this.row = row;
        this.column = column;

        let white = new CGFappearance(this.scene);
        white.setAmbient(0, 0, 0, 1);
        white.setDiffuse(1, 0, 1, 1);
        white.setEmission(1, 0, 0, 1);
        white.setSpecular(1, 0, 1, 1);
        white.setShininess(100);

        this.initBuffers();
    };

}