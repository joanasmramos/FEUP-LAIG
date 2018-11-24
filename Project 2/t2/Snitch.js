class Snitch extends CGFobject {
  /**
   * Creates a snitch vehicle following the theme based on this scene.
   * @param {Scene in which vehicle is drawn} scene
   */
   constructor(scene) {
     super(scene);

     //Vehicle parts
     this.snitchBody = new MySphere(this.scene, 1, 32, 32);
     this.snitchWing= this.wingMaking();

     this.goldenAppearance = new CGFappearance(this.scene);
     this.goldenAppearance.setAmbient(1, 0.90, 0, 1);
     this.goldenAppearance.setDiffuse(0.80, 0.80, 0.80, 1);
     this.goldenAppearance.setSpecular(0.8, 0.8, 0.8, 1);
     this.goldenAppearance.setShininess(25);
     this.goldenAppearance.loadTexture("scenes/images/threeway_painting.jpg");
   }


   /**
    *Creates the wing for Snitch Vehicle
    *@returns {Patch} representing wing
    */
    wingMaking() {
      let controlPoints = [
              [0, 0, 0, 1],
              [0, 0, -1.9, 1],
              [0, 0, -2, 1],
              [0, 0, -1.9, 1],
              [0, 0, 0, 1],


              [-0.2, 0, 0, 1],
              [-0.2, 0, -1.9, 1],
              [0, 0, -2, 1],
              [0.2, 0, -1.9, 1],
              [0.2, 0, 0, 1],

              [-0.2, 1, 0, 1],
              [-0.2, 1, -1.8, 1],
              [0, 1, -1.7, 1],
              [0.2, 1, -1.8, 1],
              [0.2, 1, 0, 1],

              [-0.2, 1.5, 0, 1],
              [-0.2, 1.5, -1.15, 1],
              [0, 1.5, -1.25, 1],
              [0.2, 1.5, -1.15, 1],
              [0.2, 1.5, 0, 1],

              [-0.2, 1.75, 0, 1],
              [-0.2, 1.75, -0.7, 1],
              [0, 1.75, -0.8, 1],
              [0.2, 1.75, -0.7, 1],
              [0.2, 1.75, 0, 1],

              [-0.2, 2, 0, 1],
              [-0.2, 2, -0.45, 1],
              [0, 2, -0.55, 1],
              [0.2, 2, -0.45, 1],
              [0.2, 2, 0, 1],

              [-0.2, 4, 0, 1],
              [-0.2, 4, 0, 1],
              [0, 4, 0.1, 1],
              [0.2, 4, 0, 1],
              [0.2, 4, 0, 1]
      ];

      return new MyPatch(this.scene, 16, 32, 6, 4, controlPoints);
    }


/**
 * Displays the vehicle.
 */
display() {
  this.goldenAppearance.apply();
  this.scene.pushMatrix();

    this.scene.translate(2, 2, 2);
    this.scene.scale(0.2, 0.2, 0.2);

    //Display body
    this.scene.pushMatrix();
      this.scene.scale(0.5, 0.5, 0.5);
    this.snitchBody.display();
    this.scene.popMatrix();


    //Display right wing
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI/6, 0, 1, 1);
    this.scene.translate(-0.3, 0, 0.2);
    this.snitchWing.display();
    this.scene.popMatrix();

    //Display left wing
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.scene.rotate(Math.PI/6, 0, 1, 1);
    this.scene.scale(1, -1, -1);
    this.scene.translate(0.3, 0, 0.1);
    this.snitchWing.display();
    this.scene.popMatrix();

  this.scene.popMatrix();

}


}
