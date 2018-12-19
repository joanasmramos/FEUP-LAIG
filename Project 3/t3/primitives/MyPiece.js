/**
 * Class Piece
 * Creates and draws a primitive of Coffee player piece given the parameters.
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);
/*
//TODO:
    A ideia aqui seria criar várias instancias de MyPiece de acordo com o tipo (brown ou orange)

*/
       //this.type = type;
       // this.row = row;
       // this.column = column;

        this.brown = new CGFappearance(this.scene);
        this.brown.setAmbient(0.19, 0.06, 0.06, 1);
        this.brown.setAmbient(0, 0, 0, 1);
        this.brown.setDiffuse(0.19, 0.06, 0.06, 1);
        this.brown.setSpecular(0.19, 0.06, 0.06, 1);
        this.brown.setShininess(100);

        this.orange = new CGFappearance(this.scene);
        this.orange.setAmbient(1, 0.15, 0, 1);
        this.orange.setAmbient(0, 0, 0, 1);
        this.orange.setDiffuse(1, 0.15, 0, 1);
        this.orange.setSpecular(1, 0.15, 0, 1);
        this.orange.setShininess(100);

        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.25, 20, 20);
        this.piece2 = new MyCylinder(this.scene, 0.5, 0.5, 0.25, 20, 20);
        this.initBuffers();
    };

    display(){
    this.scene.pushMatrix();
        this.scene.translate(1,0,1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.orange.apply();
        this.piece.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
        this.scene.translate(0.5,0,0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.brown.apply();
        this.piece2.display();
    this.scene.popMatrix();
    
    };
}