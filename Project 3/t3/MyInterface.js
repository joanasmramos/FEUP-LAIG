/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui
        
        this.gui = new dat.GUI();
        // add a group of controls (and open/expand by defult)

        this.gui_play = new dat.GUI();
        this.displayModes = true;

        return true;
    }
    /**
     * Adds a folder for game informations
     */
    addGameInformations(){
        this.gui_play.add(this.scene, 'countdown_starter').listen().name('Countdown');
        this.gui_play.add(this.scene, 'countdown_starter').listen().name('Marker +Bk/-Og'); //starting this
      //  this.gui_play.add(this.scene.changePlayer, 'turn').listen().name('Player Turn');

    }
     /**
     * Adds a folder for Game and Environment controls
     */
    addOptionsGroup(){
        let group = this.gui.addFolder("General Options");
        this.general = group;
        group.open();
       
        let Start = function (scene) {
            this.start = function(){
                if(scene.game.started) {
                    return;
                }

                scene.game.startGame();
            }
        }
        let start = new Start(this.scene);
        group.add(start, 'start').name("Start Game");

        let Undo = function (scene) {
            this.undo = function(){
                if(scene.playingFilm || !scene.game.started) {
                    return;
                }
                scene.game.undo();
            }
        }
        let undo = new Undo(this.scene);
        this.undo = group.add(undo, 'undo').name("Undo Move");

        let PlayFilm = function(scene) {
            this.playFilm = function() {
                if(scene.game.started || scene.previousGame == null) {
                    return;
                }
                scene.playFilm();
            }
        }
        let playFilm = new PlayFilm(this.scene);
        this.playFilm = group.add(playFilm, 'playFilm').name("Play Film");

        let Quit = function (scene) {
            this.quit = function(){
                if(!scene.game.started) {
                    return;
                }
                scene.quit();
            }
        }

        let quit = new Quit(this.scene);
        group.add(quit, 'quit').name("Quit Game");

        this.modes = group.add(this.scene, 'currentMode', this.scene.modes).name("Modes/Difficulties");
        group.add(this.scene, 'currentTheme', this.scene.themes).name("Environment");
    }
    /**
     * Adds a folder for lights control
     * @param {array} lights
     */
    addLightsGroup(omniLights, spotLights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in omniLights) {
            if (omniLights.hasOwnProperty(key)) {
                group.add(this.scene.omniValues, key);
            }
        }

        for (var key in spotLights) {
            if (spotLights.hasOwnProperty(key)) {
                group.add(this.scene.spotValues, key);
            }
        }
    }

    /**
     * 
     */
    addViewsGroup() {
    var group = this.gui.addFolder("Views");
        group.open();

        const cameraIdArray = Object.keys(this.scene.data.views);
        this.currentCameraId = this.scene.data.defaultView;

        group.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val)); 
    }

    /**
     * 
     * @param {event} event 
     */
    processKeyboard(event) {
        var m = 109, M=77;

        if(event.keyCode != m && event.keyCode != M)
            return;
        
        this.scene.switchComponentMaterials();

    }

    /**
     * Prompt user for board dimensions
     * @param {*} document 
     */
    getBoardDimensions(document) {
        let dimensions = prompt("Insert board dimensions.\nPossible options: 5, 6 or 7");
        while(dimensions != 5 && dimensions != 6 && dimensions != 7) {
            dimensions = prompt("Insert board dimensions.\nPossible options: 5, 6 or 7");
        }
        
        return dimensions;

        // let body = document.getElementsByTagName('body')[0];

        // let form = document.createElement('form');
        // form.setAttribute('method', 'post');
        // form.innerHTML = 
        //     '<label for="dimensions">Choose board dimensions (5/7):</label>' +
        //     '<input type="text" id="dimensions" name="dimensions" required="true">' +
        //     '<input type="submit" id="submit" value="Ready!" />';
        // console.log(form.outerHTML);

        // body.appendChild(form);

        /* CSS
        input, label {
        font: 'Verdana', sans-serif;
        text-align: center;
        width: auto;
        margin: .3em;
        justify-self: center;
        font-size: 1em;
        color: #6461a0;
        }

        input[type="text"] {
        border: ridge;
        border-color: #b497d6;
        border-width: .1em;
        border-radius: .5em;
        }

        input[type="submit"] {
        border-style: solid;
        border-width: .1em;
        border-color: gray;
        }

        label {
        font-size: 1.1em;
        font-weight: 600;
        }

        form {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr;
        padding: 1em;
        font-size: 1em;
        border-style: ridge;
        border-color: #b497d6;
        border-radius: .8em;
        background-color: #e1e2ef;
        }
        */
    }
}