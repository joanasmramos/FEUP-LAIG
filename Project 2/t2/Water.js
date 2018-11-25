class Water extends CGFobject{
    /**
     *
     * @param {Scene} scene
     * @param {Color texture} texture
     * @param {Height map texture} wavemap
     * @param {Number of parts} parts
     * @param {Height scale} heightscale
     * @param {Texture scale} texscale
     */
    constructor(scene, texture, wavemap, parts, heightscale, texscale) {
        super(scene);

        this.shader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
        this.plane = new Plane(this.scene, parts, parts);

        this.texture = texture;
        this.wavemap = wavemap;
        this.heightscale = heightscale;
        this.texscale = texscale;

        this.offset = 0;
        this.time = 0;

        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({heightmap: 1});
        this.shader.setUniformsValues({heightscale: heightscale});
        this.shader.setUniformsValues({offset: this.offset});
        this.shader.setUniformsValues({texscale: texscale});
    }

    /**
     * Display
     */
    display(){
        this.shader.setUniformsValues({timeFactor: this.scene.timeFactor});

        this.scene.setActiveShader(this.shader);

        this.texture.bind(0);
        this.wavemap.bind(1);

        this.plane.display();

        this.texture.unbind(0);
        this.wavemap.unbind(1);
        
        this.scene.setActiveShader(this.scene.defaultShader);
    }



}
