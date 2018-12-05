class Terrain extends CGFobject{
    /**
     * 
     * @param {Scene} scene 
     * @param {Color texture} texture 
     * @param {Height map texture} heightmap 
     * @param {Parts} parts 
     * @param {Height scale} heightscale 
     */
    constructor(scene, texture, heightmap, parts, heightscale) {
        super(scene);

        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");
        this.plane = new Plane(this.scene, parts, parts);

        this.texture = texture;
        this.heightmap = heightmap;
        this.heightscale = heightscale;

        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({heightmap: 1});
        this.shader.setUniformsValues({heightscale: heightscale});
    }

    /**
     * Display
     */
    display(){
        this.scene.setActiveShader(this.shader);

        this.texture.bind(0);
        this.heightmap.bind(1);

        this.plane.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}