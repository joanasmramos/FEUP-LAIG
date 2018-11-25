class Snitch extends CGFobject {
  /**
   * Creates a snitch vehicle following the theme based on this scene.
   * @param {Scene in which vehicle is drawn} scene
   */
   constructor(scene) {
     super(scene);

     //Vehicle parts
     this.snitchBody = new MySphere(this.scene, 1, 32, 32);
     this.wingMaking();

     this.goldenAppearance = new CGFappearance(this.scene);
     this.goldenAppearance.setAmbient(1, 0.90, 0, 1);
     this.goldenAppearance.setDiffuse(0.80, 0.80, 0.80, 1);
     this.goldenAppearance.setSpecular(0.8, 0.8, 0.8, 1);
     this.goldenAppearance.setShininess(25);
     this.goldenAppearance.loadTexture("scenes/images/gold.jpg");
     this.wingAppearance = new CGFappearance(this.scene);
     this.wingAppearance.setAmbient(1, 0.90, 0, 1);
     this.wingAppearance.setDiffuse(0.80, 0.80, 0.80, 1);
     this.wingAppearance.setSpecular(0.8, 0.8, 0.8, 1);
     this.wingAppearance.setShininess(25);
     this.wingAppearance.loadTexture("scenes/images/snitch-wings.jpg");
   }


   /**
    *Creates the wing for Snitch Vehicle
    *@returns {Patch} representing wing
    */
    wingMaking() {
      let controlPointsRight = [
        [0, 0, 0, 0.1],
        [0, 0, 0, 0.1],
        
        [0.3, 0, -0.5, 1],
        [0.2, 0.5, -0.5, 1],

        [0.45, 0.5, -1.3, 1],
        [0.45, 0.5, -1.3, 0.1]
      ];

      let controlPointsLeft = [
        [0, 0, 0, 0.1],
        [0, 0, 0, 0.1],
        
        [0.2, 0.5, -0.5, 1],
        [0.3, 0, -0.5, 1],

        [0.45, 0.5, -1.3, 0.1],
        [0.45, 0.5, -1.3, 1]
      ];

      this.snitchRightWing = new MyPatch(this.scene, 30, 30, 3, 2, controlPointsRight);
      this.snitchLeftWing = new MyPatch(this.scene, 30, 30, 3, 2, controlPointsLeft);
    }


/**
 * Displays the vehicle.
 */
display() {

  //snitch in (0, 0, 0)

  this.goldenAppearance.apply();
  this.scene.pushMatrix();

    //Display body
    this.scene.pushMatrix();
      this.scene.scale(0.15, 0.15, 0.15);
      this.snitchBody.display();
    this.scene.popMatrix();

    //Display left wing
    this.scene.pushMatrix();
      this.wingAppearance.apply();
      this.scene.rotate(Math.PI/6, 0, 1, 0);
      this.scene.scale(0.6, 0.6, 0.6);
      this.scene.scale(-1, 1, 1);
      this.snitchLeftWing.display();
    this.scene.popMatrix();

    //Display right wing
    this.scene.pushMatrix();
      this.wingAppearance.apply();
      this.scene.rotate(-Math.PI/6, 0, 1, 0);
      this.scene.scale(0.6, 0.6, 0.6);
      this.snitchRightWing.display();
    this.scene.popMatrix();

  this.scene.popMatrix();

}


}
