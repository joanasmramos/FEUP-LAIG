var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.data = null;
        this.lightValues = {};
        
    }

    /**
     * Updates animations
     * @param {Current time in miliseconds} currTime
     */
    update(currTime) {
        if(this.sceneInited) {
            let delta;
            if(this.lastT == null) {
                this.lastT = currTime;
                delta = 0;
            }
            else {
                delta = currTime - this.lastT;
                this.lastT = currTime;
            }
            delta *= Math.pow(10, -3); // mili seconds to seconds

            if(this.game.started) {
                if(this.currentMode == 0){

                this.countdown_starter -= delta;
                this.camera_perspectiveTurn(delta);

                if(this.countdown_starter <= 0){
                    this.quit();
                }
                if(this.game.nextTurn){
                    this.countdown_starter = 60;
                }
            }

            if(this.playingFilm) {
                this.timeForAPlay -= delta;
                if(this.timeForAPlay <= 0) {
                    this.updateFilm();
                    if(this.movesLeft.length == 0) {
                        this.timeForAPlay = 4;
                        return;
                    }
                    this.game.changeTurns();
                    this.timeForAPlay = 4;
                }
            }

            //missing bots
            }
        }
    }

    /**
     * Creates new Game and quits
     * 
     */
    quit() {
        this.selectView(this.data.views[this.data.defaultView]);
        this.countdown_starter = 60;
        this.previousGame = this.game;
        this.game = new Game(this, 5);
    }

    /**
     * Updates countdown of each play
     * 
     */
    countdown() {
        return this.countdown_starter;
    }

    /**
     * Updates camera perspective rotating during rotTime seconds.
     * @param {Time in seconds} delta 
     */
    camera_perspectiveTurn(delta) {
        if(this.time_passed >= this.rotTime && this.game.nextTurn) {
            this.rotational_angle = (Math.PI/this.rotTime) * (this.rotTime - this.time_passed);
            this.camera.orbit([0,1,0], this.rotational_angle);

            this.rotational_angle = 0;
            this.time_passed = 0;
            this.game.nextTurn = false;
        } else if (this.game.nextTurn) {
            this.time_passed += delta;
            this.rotational_angle = (Math.PI/this.rotTime)*delta;
            this.camera.orbit([0,1,0], this.rotational_angle);
        }
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.defaultAppearance = new CGFappearance(this);

        this.sceneInited = false;

        this.initCameras();
        this.omniValues = [];
        this.spotValues = [];
        this.timeFactor = 0;

        this.themes = {};
        this.themes['retro'] = 0;
        this.themes['1920'] = 1;
        this.currentTheme = 0;

        this.modes = {};
        this.modes['Human vs Human'] = 0;
        this.modes['Human vs Bot Easy'] = 1;
        this.currentMode = 0;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.server = new MyClient(8081);
        this.lastT = null;
        this.orange = false;

        this.rotTime = 2;
        this.rotational_angle = 0;
        this.time_passed = 0;
        

        this.countdown_starter = 60;
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.cameraBrown = new CGFcamera(Math.PI/6, 0.1, 500, vec3.fromValues(2.5, 23, -4), vec3.fromValues(2.5, 0, 2.5));
        this.cameraOrange = new CGFcamera(Math.PI/6, 0.1, 500, vec3.fromValues(2.5, 23, 10), vec3.fromValues(2.5, 0, 2.5));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;

        for(var key in this.data.omniLights) {
            if(i>=8)
                break;

            this.lights[i].setPosition(this.data.omniLights[key].location["x"], this.data.omniLights[key].location["y"], this.data.omniLights[key].location["z"], this.data.omniLights[key].location["w"]);
            this.lights[i].setAmbient(this.data.omniLights[key].ambient["r"], this.data.omniLights[key].ambient["g"], this.data.omniLights[key].ambient["b"], this.data.omniLights[key].ambient["a"]);
            this.lights[i].setDiffuse(this.data.omniLights[key].diffuse["r"], this.data.omniLights[key].diffuse["g"], this.data.omniLights[key].diffuse["b"], this.data.omniLights[key].diffuse["a"]);
            this.lights[i].setSpecular(this.data.omniLights[key].specular["r"], this.data.omniLights[key].specular["g"], this.data.omniLights[key].specular["b"], this.data.omniLights[key].specular["a"]);

            if(this.data.omniLights[key].enabled)
                this.lights[i].enable();
            else this.lights[i].disable();

            this.omniValues[key] = this.data.omniLights[key].enabled;

            this.lights[i].update();

            i++;
        }

        for(var key in this.data.spotLights) {
            if(i>=8)
                break;

            this.lights[i].setSpotCutOff(this.data.spotLights[key].angle);
            this.lights[i].setSpotExponent(this.data.spotLights[key].exponent);
            this.lights[i].setSpotDirection(this.data.spotLights[key].direction["x"], this.data.spotLights[key].direction["y"], this.data.spotLights[key].direction["z"]);
            this.lights[i].setPosition(this.data.spotLights[key].location["x"], this.data.spotLights[key].location["y"], this.data.spotLights[key].location["z"], this.data.spotLights[key].location["w"]);
            this.lights[i].setAmbient(this.data.spotLights[key].ambient["r"], this.data.spotLights[key].ambient["g"], this.data.spotLights[key].ambient["b"], this.data.spotLights[key].ambient["a"]);
            this.lights[i].setDiffuse(this.data.spotLights[key].diffuse["r"], this.data.spotLights[key].diffuse["g"], this.data.spotLights[key].diffuse["b"], this.data.spotLights[key].diffuse["a"]);
            this.lights[i].setSpecular(this.data.spotLights[key].specular["r"], this.data.spotLights[key].specular["g"], this.data.spotLights[key].specular["b"], this.data.spotLights[key].specular["a"]);

            if(this.data.spotLights[key].enabled)
                this.lights[i].enable();
            else this.lights[i].disable();

            this.spotValues[key] = this.data.spotLights[key].enabled;

            this.lights[i].update();

            i++;
        }
    }

    /**
     *
     * @param {View id} id
     */
    selectView(id) {
        this.camera = this.data.views[this.data.defaultView];
        this.interface.setActiveCamera(null);
    }

    /**
     *
     */
    switchComponentMaterials() {
        for(var key in this.graph.nodes) {
            this.graph.nodes[key].switchMaterial();
        }

        console.log("Switched materials!");
    }

    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        //<scene>
        this.axis = new CGFaxis(this, this.data.axisLength);

        //<views>
        this.camera = this.data.views[this.data.defaultView];
        this.defaultCamera = this.camera;
        this.interface.setActiveCamera(null);

        //<ambient>
        this.setGlobalAmbientLight(this.data.ambientLight["r"], this.data.ambientLight["g"], this.data.ambientLight["b"], this.data.ambientLight["a"]);
        this.gl.clearColor(this.data.backgroundColor["r"], this.data.backgroundColor["g"], this.data.backgroundColor["b"], this.data.backgroundColor["a"]);

        this.initLights();

        // Add lights group.
        this.interface.addLightsGroup(this.data.omniLights, this.data.spotLights);
        //this.interface.addViewsGroup();
        this.interface.addOptionsGroup();
        this.interface.addGameInformations();

        this.sceneInited = true;
        this.setUpdatePeriod(1000/60);

        // this.graph.boardDimensions = this.interface.getBoardDimensions(this.document);
        // this.graph.board = new MyBoard(this, this.graph.boardDimensions);
        
        this.game = new Game(this, 5);
        this.previousGame = null;

        this.setPickEnabled(true);
    }

    playFilm(){
        this.game.startGame();
        this.game.board.pickable = false;
        this.movesLeft = this.previousGame.boardPieces;
        this.playingFilm = true;
        this.timeForAPlay = 4;
    }

    updateFilm() {
        if(this.movesLeft.length == 0) {
            this.playingFilm = false;
            this.timeForAPlay = 4;
            this.camera = this.defaultCamera;
            this.game = new Game(this, 5);
            return;
        }
        let move = this.movesLeft[0];
        this.game.boardPieces.push(move);
        this.movesLeft.splice(0, 1);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            //this.axis.display();

            var i = 0;
            for (var key in this.omniValues) {
                if (this.omniValues.hasOwnProperty(key)) {
                    if (this.omniValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            for (var key in this.spotValues) {
                if (this.spotValues.hasOwnProperty(key)) {
                    if (this.spotValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            if(this.currentTheme == 0) {
                this.graph.nodes["retro"].isActive = true;
                this.graph.nodes["1920"].isActive = false;
            }
            else {
                this.graph.nodes["retro"].isActive = false;
                this.graph.nodes["1920"].isActive = true;
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
            this.game.display();

        }
        else {
            // Draw axis
            this.axis.display();
        }  

        this.popMatrix();
    }
}
