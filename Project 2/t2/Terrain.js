class Terrain extends CGFobject{
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.testShader = new CGFshader(this.scene.gl, "shaders/test.vert", "shaders/test.frag");
        this.testPlane = new Plane(this.scene, parts, parts);

        this.texture = texture;
        this.heightmap = heightmap;
        this.heightscale = heightscale;

        this.testShader.setUniformsValues({texture: 0});
        this.testShader.setUniformsValues({heightmap: 1});
        this.testShader.setUniformsValues({heightscale: heightscale});
    }

    display(){
        this.scene.setActiveShader(this.testShader);

        this.texture.bind(0);
        this.heightmap.bind(1);

        this.testPlane.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}