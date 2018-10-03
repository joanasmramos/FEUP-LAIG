var DEGREE_TO_RAD = Math.PI / 180;

/*
ERROS:
// escrever aqui se existir algum problema com a versão atual
*/

// Order of the groups in the XML document.

var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
/*
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;
*/
var R_INDEX = 0;
var G_INDEX = 1;
var B_INDEX = 2;
var A_INDEX = 3;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraphAdapt {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.data = new MySceneData();
        this.scene.data = this.data;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }



    /**
    * Verifies if element is not null
    * @param  {element to verify} element
    */
    verifyElement(element) {
        if (element != null)
            return true;
        return false;
    }

    /**
    * Verifies string (is not empty/null)
    * @param {string to verify} str
    */
    verifyString(str) {
        if (str != "" && this.verifyElement(str))
            return true;
        return false;
    }

    /**
     * Verifies if a string is valid and equal to another
     * @param {string to verify} str
     * @param {string to compare with} strModel
     */
    verifyStringEqual(str, strModel) {
        if (this.verifyString(str) && str == strModel)
            return true;
        return false;
    }

    /**
     * Verifies if a float is valid
     * @param {float to verify} fl
     */
    verifyFloat(fl) {
        if (this.verifyElement(fl) && !isNaN(fl))
            return true;
        return false;
    }

    /**
     * Verifies an array of strings and an array of floats
     * @param {strings to verify} strs 
     * @param {floats} fls 
     */
    verifyStringsFloats(strs, fls) {
        for (let i = 0; i < strs.length; i++) {
            if (!this.verifyString(strs[i]))
                return false;
        }

        for (let i = 0; i < fls.length; i++) {
            if (!this.verifyFloat(fls[i]))
                return false;
        }
        return true;
    }    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        var errorRoot = !this.verifyStringEqual(rootElement.nodeName, "yas");

        if (errorRoot)
            return "Something wrong with tag <yas>";

        var rootChildren = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < rootChildren.length; i++) {
            nodeNames.push(rootChildren[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(rootChildren[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(rootChildren[index])) != null)
                return error;
        }

        //<ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1) {
            return "tag <ambient> missing";
        }
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(rootChildren[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(rootChildren[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("MATERIALS")) == -1)
            return "tag <MATERIALS> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <MATERIALS> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(rootChildren[index])) != null)
                return error;
        }

        //VI ATÉ AQUI
        //------------------------------------------------------------------

        // <LIGHTS>
        if ((index = nodeNames.indexOf("LIGHTS")) == -1)
            return "tag <LIGHTS> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <LIGHTS> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(rootChildren[index])) != null)
                return error;
        }

        // <NODES>
        if ((index = nodeNames.indexOf("NODES")) == -1)
            return "tag <NODES> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <NODES> out of order");

            //Parse NODES block
            if ((error = this.parseNodes(rootChildren[index])) != null)
                return error;
        }

    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        //é preciso verificar depois nos components se este id existe
        this.idRoot = this.reader.getString(sceneNode, 'root');
        this.data.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (!this.verifyString(this.idRoot))
            return "You must define a root component in the <scene> tag";

        if (!this.verifyFloat(this.data.axisLength)) {
            this.data.axisLength = 1;
            this.onXMLMinorError("unable to parse value for axis length; assuming axis length = 1");
        }

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        var perspectives = viewsNode.getElementsByTagName("perspective");
        var orthos = viewsNode.getElementsByTagName("ortho");

        if (perspectives.length == 0 && orthos.length == 0)
            return "<views> - you must define at least one perspective/ortho view";


        var id, near, far, angle, from, to;

        for (let i = 0; i < perspectives.length; i++) {
            id = this.reader.getString(perspectives[i], "id", true);
            near = this.reader.getFloat(perspectives[i], "near", true);
            far = this.reader.getFloat(perspectives[i], "far", true);
            angle = this.reader.getFloat(perspectives[i], "angle", true);
            //from = this.reader.getVector3(perspectives[i], "from", true);
            //to = this.reader.getVector3(perspectives[i], "to");
            if (!this.verifyStringsFloats([id], [near, far, angle]))
                return "<views> - something wrong with perspectives";

        }


        /*
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName == "perspective") {
                idp = children[i].getAttribute("id");
                near = children[i].getAttribute("near");
                far = children[i].getAttribute("far");
                angle = children[i].getAttribute("angle");
                from = vec3.fromValues(children[i].firstElementChild.getAttribute("x"),
                    children[i].firstElementChild.getAttribute("y"),
                    children[i].firstElementChild.getAttribute("z"));
                to = vec3.fromValues(children[i].lastElementChild.getAttribute("x"),
                    children[i].lastElementChild.getAttribute("y"),
                    children[i].lastElementChild.getAttribute("z"));
                //TO DO: fazer verificações (muitas), construir camara, map e por na data
            }
        }
        */

        this.data.defaultView = this.reader.getString(viewsNode, 'default', true);
        //TO DO: verificar se defaultView é válido (existe, não nulo, é um id de alguma view)

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block. 
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        var children = ambientsNode.children;

        if (children.length == 0)
            return "You must define an ambient/background component in the <ambient> tag";
        else {
            var red, green, blue, alpha;

            for (let i = 0; i < children.length; i++) {
                red = this.reader.getFloat(children[i], 'r');
                green = this.reader.getFloat(children[i], 'g');
                blue = this.reader.getFloat(children[i], 'b');
                alpha = this.reader.getFloat(children[i], 'a');
                if (children[i].nodeName == "ambient") {
                    if (validate_RBG(red)) this.data.ambientComponent[R_INDEX] = red;
                    else {
                        this.onXMLMinorError("Unable to parse color red in ambient component. Assuming 'r' = 1");
                        this.data.ambientComponent[R_INDEX] = 1;
                    }
                    if (validate_RBG(green)) this.data.ambientComponent[G_INDEX] = green;
                    else {
                        this.onXMLMinorError("Unable to parse color green in ambient component. Assuming 'g' = 1");
                        this.data.ambientComponent[G_INDEX] = 1;
                    }
                    if (validate_RBG(blue)) this.data.ambientComponent[B_INDEX] = blue;
                    else {
                        this.onXMLMinorError("Unable to parse color blue in ambient component. Assuming 'b' = 1");
                        this.data.ambientComponent[B_INDEX] = 1;
                    }
                    if (validate_RBG(alpha)) this.data.ambientComponent[A_INDEX] = alpha;
                    else {
                        this.onXMLMinorError("Unable to parse alpha in ambient component. Assuming 'a' = 1");
                        this.data.ambientComponent[A_INDEX] = 1;
                    }
                }
                if (children[i].nodeName == "background") {
                    if (validate_RBG(red)) this.data.backgroundComponent[R_INDEX] = red;
                    else {
                        this.onXMLMinorError("Unable to parse color red in background component. Assuming 'r' = 1");
                        this.data.backgroundComponent[R_INDEX] = 1;
                    }
                    if (validate_RBG(green)) this.data.backgroundComponent[G_INDEX] = green;
                    else {
                        this.onXMLMinorError("Unable to parse color green in background component. Assuming 'g' = 1");
                        this.data.backgroundComponent[G_INDEX] = 1;
                    }
                    if (validate_RBG(blue)) this.data.backgroundComponent[B_INDEX] = blue;
                    else {
                        this.onXMLMinorError("Unable to parse color blue in background component. Assuming 'b' = 1");
                        this.data.backgroundComponent[B_INDEX] = 1;
                    }
                    if (validate_RBG(alpha)) this.data.backgroundComponent[A_INDEX] = alpha;
                    else {
                        this.onXMLMinorError("Unable to parse alpha in background component. Assuming 'a' = 1");
                        this.data.backgroundComponent[A_INDEX] = 1;
                    }
                }
            }
        }

        this.log("Parsed ambient");

        return null;
    }


    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        if (children.length == 0)
            return "You must define a texture in the <textures> tag";
        else {
            //confirmar nos components se o id é o mesmo
            var id_texture, file_texture;

            for (let i = 0; i < children.length; i++) {
                if (children[i].nodeName == "texture") {
                    this.id_texture = this.reader.getString(children[i], 'id');
                    this.file_texture = this.reader.getString(children[i], 'file');

                    if (!(this.id_texture != null && this.id_texture != "")) {
                        return "ID for texture in <textures> tag  is empty";
                    } else this.data.id_texture = id_texture;
                    if (!(this.file_texture != null && this.file_texture != "")) {
                        return "file for texture in <textures> tag  is missing";
                    } else this.data.file_texture = file_texture;
                }
            }
        }
        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */

    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var grandChildren = [];

        if (children.length == 0)
            return "You must define a material in the <materials> tag";
        else {
            //confirmar nos components se o id é o mesmo
            var id_material, shininess_material;
            var red, green, blue, alpha;
            for (let i = 0; i < children.length; i++) {
                grandChildren = children[i].children;

                if (children[i].nodeName == "material") {
                    this.id_material = this.reader.getString(children[i], 'id');
                    this.shininess_material = this.reader.getFloat(children[i], 'shininess');

                    if (verifyString(id_material)) this.data.id_material = id_material;
                    else return "ID for material in <materials> tag  is empty";

                    if (!(this.shininess_material != null && !isNaN(this.shininess_material))) {
                        this.shininess_material = 1;
                        this.data.shininess_material = shininess_material;
                        this.onXMLMinorError("unable to parse value for shininess; assuming shininess = 1");
                    }
                    for (let i = 0; i < grandChildren.length; i++) {
                        red = this.reader.getFloat(grandChildren[i], 'r');
                        green = this.reader.getFloat(grandChildren[i], 'g');
                        blue = this.reader.getFloat(grandChildren[i], 'b');
                        alpha = this.reader.getFloat(grandChildren[i], 'a');

                        if (grandChildren[i].nodeName == "emission") {
                            if (validate_RBG(red)) this.data.emission_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in emission component. Assuming 'r' = 1");
                                this.data.emission_material[R_INDEX] = 1;
                            }
                            if (validate_RBG(green)) this.data.emission_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in emission component. Assuming 'g' = 1");
                                this.data.emission_material[G_INDEX] = 1;
                            }
                            if (validate_RBG(blue)) this.data.emission_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in emission component. Assuming 'b' = 1");
                                this.data.emission_material[B_INDEX] = 1;
                            }
                            if (validate_RBG(alpha)) this.data.emission_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in emission component. Assuming 'a' = 1");
                                this.data.emission_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "ambient") {
                            if (validate_RBG(red)) this.data.ambient_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in ambient component. Assuming 'r' = 1");
                                this.data.ambient_material[R_INDEX] = 1;
                            }
                            if (validate_RBG(green)) this.data.ambient_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in ambient component. Assuming 'g' = 1");
                                this.data.ambient_material[G_INDEX] = 1;
                            }
                            if (validate_RBG(blue)) this.data.ambient_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in ambient component. Assuming 'b' = 1");
                                this.data.ambient_material[B_INDEX] = 1;
                            }
                            if (validate_RBG(alpha)) this.data.ambient_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in ambient component. Assuming 'a' = 1");
                                this.data.ambient_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "diffuse") {
                            if (validate_RBG(red)) this.data.diffuse_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in diffuse component. Assuming 'r' = 1");
                                this.data.diffuse_material[R_INDEX] = 1;
                            }
                            if (validate_RBG(green)) this.data.diffuse_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in diffuse component. Assuming 'g' = 1");
                                this.data.diffuse_material[G_INDEX] = 1;
                            }
                            if (validate_RBG(blue)) this.data.diffuse_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in diffuse component. Assuming 'b' = 1");
                                this.data.diffuse_material[B_INDEX] = 1;
                            }
                            if (validate_RBG(alpha)) this.data.diffuse_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in diffuse component. Assuming 'a' = 1");
                                this.data.diffuse_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "specular") {
                            if (validate_RBG(red)) this.data.specular_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in specular component. Assuming 'r' = 1");
                                this.data.specular_material[R_INDEX] = 1;
                            }
                            if (validate_RBG(green)) this.data.specular_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in specular component. Assuming 'g' = 1");
                                this.data.specular_material[G_INDEX] = 1;
                            }
                            if (validate_RBG(blue)) this.data.specular_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in specular component. Assuming 'b' = 1");
                                this.data.specular_material[B_INDEX] = 1;
                            }
                            if (validate_RBG(alpha)) this.data.specular_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in specular component. Assuming 'a' = 1");
                                this.data.specular_material[A_INDEX] = 1;
                            }
                        }
                    }
                }
            }
        }
        this.log("Parsed materials");
        return null;
    }


    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var omni = lightsNode.getElementsByTagName('omni');
        var spot = lightsNode.getElementsByTagName('spot');
        var children = lightsNode.children;
        var grandChildren = [];
        this.lights = [];
        var numLights = 0;

        if (omni.length == 0 && spot.length == 0)
            return "You must define an omni/spot light in the <lights> tag";
        else {
            var xx, yy, zz, ww;
            var red, blue, green, alpha;
            var id_lights, enabled, angle, exponential;
            this.enabled = false;
            /*
                    // Checks for repeated IDs.
                    if (this.lights[id_lights] != null)
                        return "ID must be unique for each light (conflict: ID = " + id_lights + ")";
                    for (let i = 0; i < omni.length; i++) {
                        this.id_lights = this.reader.getFloat(omni[i], 'id', true);
                    }
        
                    for(let i = 0; i < spot.length; i++) {
                        this.id_lights = this.reader.getFloat(spot[i], 'id', true);
        
        
                    }
        
        
        
                            grandChildren = children[i].children;
        
                            // Get id of the current light.
                            if (lightId == null)
                                return "no ID defined for light";
        
        
                            // Light enable/disable
                            var enableLight = true;
                            if (enableIndex == -1) {
                                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
                            }
                            else {
                                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                                else
                                    enableLight = aux == 0 ? false : true;
                            }
        
                            // Retrieves the light position.
                            var positionLight = [];
                            if (positionIndex != -1) {
                                // x
                                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                                if (!(x != null && !isNaN(x)))
                                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                                else
                                    positionLight.push(x);
        
                            }
                            else
                                return "light position undefined for ID = " + lightId;
        
                            // Retrieves the ambient component.
                            var ambientIllumination = [];
                            if (ambientIndex != -1) {
                                // R
                                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                                else
                                    ambientIllumination.push(r);
        
                            }
                            else
                                return "ambient component undefined for ID = " + lightId;
        
                            // TODO: Retrieve the diffuse component
        
                            // TODO: Retrieve the specular component
        
                          // TODO: Store Light global information.
                            //this.lights[lightId] = ...;  
                            numLights++;
                        }
        
                        if (numLights == 0 || numLights > 8 )
                            this.onXMLMinorError("WebGL imposes a minimun of 1 lights and a limit of 8 lights");
                            */
                    }
            this.log("Parsed lights");

            return null;
        }


        /**
         * Parses the <NODES> block.
         * @param {nodes block element} nodesNode
         */
        parseNodes(nodesNode) {
            // TODO: Parse block
            this.log("Parsed nodes");
            return null;
        }

        /*
         * Callback to be executed on any read error, showing an error on the console.
         * @param {string} message
         */
        onXMLError(message) {
            console.error("XML Loading Error: " + message);
            this.loadedOk = false;
        }

        /**
         * Callback to be executed on any minor error, showing a warning on the console.
         * @param {string} message
         */
        onXMLMinorError(message) {
            console.warn("Warning: " + message);
        }


        /**
         * Callback to be executed on any message.
         * @param {string} message
         */
        log(message) {
            console.log("   " + message);
        }

        /**
         * Displays the scene, processing each node, starting in the root node.
         */
        displayScene() {
            // entry point for graph rendering
            //TODO: Render loop starting at root of graph
        }

        validate_RBG(color) {
            if (color != null) {
                if (isNaN(color)) return false;
                else if (color < 0 || color > 0) return false;
                else return true;
            } else return false;
        }
    }