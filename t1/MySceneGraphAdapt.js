var DEGREE_TO_RAD = Math.PI / 180;

/*
ERROS:
// escrever aqui se existir algum problema com a versão atual
*//*
RELEMBRAR:
NÃO PODEMOS FAZER LIGHTS[1] = NOVA LIGHT (na xmlscene), APENAS DAR SET DAS COISAS
*/

// Order of the groups in the XML document.

var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
/*
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
     * Verifies if an array of strings and an array of floats are valid
     * @param {strings to verify} strs 
     * @param {floats to verify} fls 
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
    }
    /**
    * Verifies if an array of elements is valid (not null)
    * @param {Elements to verify} elems 
    */
    verifyElems(elems) {
        for (let i = 0; i < elems.length; i++) {
            if (!this.verifyElement(elems[i]))
                return false;
        }

        return true;
    }

    /**
     * Reads x, y, z from a DOM element, returns vec3 from values
     * @param {element} elem
     */
    readXYZ(elem) {
        var x, y, z;
        x = this.reader.getFloat(elem, "x", true);
        y = this.reader.getFloat(elem, "y", true);
        z = this.reader.getFloat(elem, "z", true);
        return vec3.fromValues(x, y, z);
    }

    /**
     * Readz x, y and z from a DOM element, returns an associative array with xyz
     * @param {element} elem 
     */
    readXYZarray(elem) {
        var xyz = [];

        xyz["x"] = this.reader.getFloat(elem, "x", true);
        xyz["y"] = this.reader.getFloat(elem, "y", true);
        xyz["z"] = this.reader.getFloat(elem, "z", true);

        return xyz;
    }

    /**
     * Reads x, y, z and w from a DOM element, returns associative array with xyzw
     * @param {element} elem 
     */
    readXYZW(elem) {
        var xyzw = [];

        xyzw["x"] = this.reader.getFloat(elem, "x", true);
        xyzw["y"] = this.reader.getFloat(elem, "y", true);
        xyzw["z"] = this.reader.getFloat(elem, "z", true);
        xyzw["w"] = this.reader.getFloat(elem, "w", true);

        return xyzw;
    }

    /**
     * Reads r, g, b and a from a DOM element, returns array 
     * @param {element} elem 
     */
    readRGBA(elem) {
        var rgba = [];

        rgba["r"] = this.reader.getFloat(elem, "r", true);
        rgba["g"] = this.reader.getFloat(elem, "g", true);
        rgba["b"] = this.reader.getFloat(elem, "b", true);
        rgba["a"] = this.reader.getFloat(elem, "a", true);

        return rgba;
    }

    /**
     * Validates an rgb component (r, g, b, a)
     * @param {color} color 
     */
    validate_RGB(color) {
        if (!this.verifyElement(color) || !this.verifyFloat(color) || color < 0 || color > 1) {
            return false;
        }

        return true;
    }

    /**
     * Validates rgb
     * @param {color} color
     */
    validate_RGBs(color) {
        for (var key in color) {
            if (!this.validate_RGB(color[key]))
                return false;
        }
        return true;
    }

    /**
     * Validates an array of rgba elements
     * @param {colors} colors 
     */
    validateRGBAs(colors) {
        for (let i = 0; i < colors.length; i++) {
            if (!this.validate_RGBs(colors[i]))
                return false;
        }

        return true;
    }

    /**
     * Verifies if an associative array of floats is valid
     * @param {array} arr
     */
    verifyAssocArr(arr) {
        for (var key in arr) {
            if (!this.verifyFloat(arr[key]))
                return false;
        }

        return true;
    }

    /**
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

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(rootChildren[index])) != null)
                return error;
        }

        // <textures>
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
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(rootChildren[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(rootChildren[index])) != null)
                return error;
        }



        //VI ATÉ AQUI
        //------------------------------------------------------------------

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

        if (!this.verifyStringsFloats([this.idRoot], [this.data.axisLength]))
            return "<scene> - something wrong with attributes";

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

        var id, near, far, angle, from, to, fromTag, toTag;

        //read perspectives
        for (let i = 0; i < perspectives.length; i++) {
            id = this.reader.getString(perspectives[i], "id", true);

            if (!this.verifyString(id) || this.data.views[id] != null)
                return "views - something wrong with a perspective's id";

            near = this.reader.getFloat(perspectives[i], "near", true);
            far = this.reader.getFloat(perspectives[i], "far", true);
            angle = this.reader.getFloat(perspectives[i], "angle", true);
            fromTag = perspectives[i].getElementsByTagName("from")[0];
            toTag = perspectives[i].getElementsByTagName("to")[0];

            if (!this.verifyElems([fromTag, toTag]))
                return "<views> - something wrong with a perspective's from/to element";

            from = this.readXYZ(fromTag);
            to = this.readXYZ(toTag);

            if (!this.verifyStringsFloats([], [near, far, angle, from[0], from[1], from[2], to[0], to[1], to[2]]))
                return "<views> - something wrong with a perspective's children values";

            this.data.views[id] = new CGFcamera(angle, near, far, from, to);
        }

        //TO DO: orthos

        this.data.defaultView = this.reader.getString(viewsNode, 'default', true);

        if (!this.verifyString(this.data.defaultView) || this.data.views[this.data.defaultView] == null)
            return "views - something wrong with perspectives";

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> block. 
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {
        var child1 = ambientsNode.firstElementChild;
        var child2 = child1.nextElementSibling;

        if (!this.verifyElems([child1, child2]))
            return "<ambient> - something wrong with child elements";

        if (child1.nodeName == "ambient" && child2.nodeName == "background") {
            this.data.ambientLight = this.readRGBA(child1);
            this.data.backgroundColor = this.readRGBA(child2);
        }
        else if (child1.nodeName == "background" && child2.nodeName == "ambient") {
            this.data.ambientLight = this.readRGBA(child2);
            this.data.backgroundColor = this.readRGBA(child1);
        }
        else return "<ambient> - something wrong with child elements";

        var a = Object.keys(this.data.ambientLight).length;

        if (!this.validateRGBAs([this.data.ambientLight, this.data.backgroundColor]))
            return "<ambient> - something wrong, check values for RGBA";

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var omni = lightsNode.getElementsByTagName('omni');
        var spot = lightsNode.getElementsByTagName('spot');

        if (omni.length == 0 && spot.length == 0)
            return "You must define an omni/spot light in the <lights> tag";

        var id;
        var locationTag, ambientTag, diffuseTag, specularTag, targetTag;

        //read omnilights
        for (let i = 0; i < omni.length; i++) {
            id = this.reader.getString(omni[i], "id", true);

            if (!(this.verifyString(id) || this.data.omniLights[id] != null))
                return "<lights> - something wrong with omni's id";

            this.data.omniLights[id] = new Object();
            this.data.omniLights[id].enabled = this.reader.getFloat(omni[i], 'enabled', true);

            if (this.data.omniLights[id].enabled == 1)
                this.data.omniLights[id].enabled = true;
            else if (this.data.omniLights[id].enabled == 0)
                this.data.omniLights[id].enabled = false;
            else return "<lights> - something wrong with omni's enable values";

            locationTag = omni[i].getElementsByTagName('location')[0];
            ambientTag = omni[i].getElementsByTagName('ambient')[0];
            diffuseTag = omni[i].getElementsByTagName("diffuse")[0];
            specularTag = omni[i].getElementsByTagName("specular")[0];

            if (!this.verifyElems([locationTag, ambientTag, diffuseTag, specularTag]))
                return "<lights> - something wrong with omni";

            this.data.omniLights[id].location = this.readXYZW(locationTag);
            this.data.omniLights[id].ambient = this.readRGBA(ambientTag);
            this.data.omniLights[id].diffuse = this.readRGBA(diffuseTag);
            this.data.omniLights[id].specular = this.readRGBA(specularTag);

            if (!this.verifyAssocArr(this.data.omniLights[id].location))
                return "<lights> - something wrong with omni's xyzw values";

            if (!this.validateRGBAs([this.data.omniLights[id].ambient, this.data.omniLights[id].diffuse, this.data.omniLights[id].specular]))
                return "<lights> - something wrong with omni's rgb values";

            if (++this.data.numLights >= 8)
                return "<lights> - you can't have more than 8 lights";
        }

        //read spotlights
        for (let i = 0; i < spot.length; i++) {
            id = this.reader.getString(spot[i], "id", true);

            if (!(this.verifyString(id) || this.data.spotLights[id] != null))
                return "<lights> - something wrong with spots's id";

            this.data.spotLights[id] = new Object();
            this.data.spotLights[id].enabled = this.reader.getFloat(spot[i], 'enabled', true);
            this.data.spotLights[id].angle = this.reader.getFloat(spot[i], 'angle', true);
            this.data.spotLights[id].exponent = this.reader.getFloat(spot[i], 'exponent', true);

            if (this.data.spotLights[id].enabled == 1)
                this.data.spotLights[id].enabled = true;
            else if (this.data.spotLights[id].enabled == 0)
                this.data.spotLights[id].enabled = false;
            else return "<lights> - something wrong with spots's enable values";

            if (!this.verifyStringsFloats([], [this.data.spotLights[id].angle, this.data.spotLights[id].exponent]))
                return "<lights> - something wrong with spot's attributes";

            locationTag = spot[i].getElementsByTagName('location')[0];
            targetTag = spot[i].getElementsByTagName('target')[0];
            ambientTag = spot[i].getElementsByTagName('ambient')[0];
            diffuseTag = spot[i].getElementsByTagName("diffuse")[0];
            specularTag = spot[i].getElementsByTagName("specular")[0];

            if (!this.verifyElems([locationTag, targetTag, ambientTag, diffuseTag, specularTag]))
                return "<lights> - something wrong with spot children";

            this.data.spotLights[id].location = this.readXYZW(locationTag);
            this.data.spotLights[id].target = this.readXYZarray(targetTag);

            this.data.spotLights[id].direction = [];
            this.data.spotLights[id].direction["x"] = this.data.spotLights[id].target["x"] - this.data.spotLights[id].location["x"];
            this.data.spotLights[id].direction["y"] = this.data.spotLights[id].target["y"] - this.data.spotLights[id].location["y"];
            this.data.spotLights[id].direction["z"] = this.data.spotLights[id].target["z"] - this.data.spotLights[id].location["z"];

            this.data.spotLights[id].ambient = this.readRGBA(ambientTag);
            this.data.spotLights[id].diffuse = this.readRGBA(diffuseTag);
            this.data.spotLights[id].specular = this.readRGBA(specularTag);

            if (!this.verifyAssocArr(this.data.spotLights[id].location) || !this.verifyAssocArr(this.data.spotLights[id].target))
                return "<lights> - something wrong with spot's xyzw values";

            if (!this.validateRGBAs([this.data.spotLights[id].ambient, this.data.spotLights[id].diffuse, this.data.spotLights[id].specular]))
                return "<lights> - something wrong with spot's rgb values";

            if (++this.data.numLights >= 8)
                return "<lights> - you can't have more than 8 lights";
        }

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var textures = texturesNode.getElementsByTagName('texture');

        if (textures.length == 0)
            return "<textures> - you must define at least one texture";

        var id;
        for (let i = 0; i < textures.length; i++) {
            id = this.reader.getString(textures[i], 'id', true);

            if (!this.verifyString(id) || this.data.textures[id] != null)
                return "<textures> - something wrong with texture's id";

            this.data.textures[id] = this.reader.getString(textures[i], 'file', true);

            if (!this.verifyString(this.data.textures[id]))
                return "<textures> - something wrong with texture's file";
        }

        this.log("Parsed textures");
        return null;
    }


    /**
 * Parses the <transformations> block.
 * @param {nodes block element} transformationNode
 */
    parseTransformations(transformationsNode) {
        var transformation = transformationsNode.getElementsByTagName('transformation');

        if (transformation.length == 0)
            return "You must define at least one transformation in the <transformations> tag";

        var id;
        var translateTag, rotateTag, scaleTag;
        var vector, axis, angle;

        for (let i = 0; i < transformation.length; i++) {
            id = this.reader.getString(transformation[i], "id", true);

            if (!(this.verifyString(id) || this.data.transformations[id] != null))
                return "<transformations> - something wrong with the transformation id";

            this.data.transformations[id] = new Object();

            if (this.transformation[id].length == 0) {
                return "a transformation needs to have an effective action (translate/rotate/scale)";
            }
            else {

                var identMatrix = mat4.create();
                //creating identitymatrix

                for (let j = 0; j < transformation[id].length; i++) {

                    switch (transformation[id].nodeName[j]) {
                        case "translate":
                            translateTag = transformation[id].getElementsByTagName("translate")[0];
                            vector = this.readXYZ(translateTag);

                            mat4.translate(identMatrix, identMatrix, vector);
                            break;
                        case "rotate":
                            rotateTag = transformation[id].getElementsByTagName("rotate")[0];
                            axis = this.transformation[id].nodeName[j].getAttribute('axis');
                            angle = this.reader.getFloat(transformation[id].nodeName[j], 'angle', true);
                            vec3.set(vector, axis, angle);

                            mat4.rotate(identMatrix,identMatrix,vector);
                            break;
                        case "scale":
                            scaleTag = transformation[id].getElementsByTagName("scale")[0];
                            vector = this.readXYZ(scaleTag);

                            mat4.scale(identMatrix,identMatrix,vector);
                            break;
                        default:
                            break;
                    }
                }
            }


        }
        /*

            if (!this.verifyAssocArr(this.data.omniLights[id].location))
                return "<lights> - something wrong with omni's xyzw values";
    
            if (!this.validateRGBAs([this.data.omniLights[id].ambient, this.data.omniLights[id].diffuse, this.data.omniLights[id].specular]))
                return "<lights> - something wrong with omni's rgb values";
        }
        */
        this.log("Parsed transformations");


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

                    if (this.verifyString(id_material)) this.data.id_material = id_material;
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
                            if (this.validate_RGB(red)) this.data.emission_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in emission component. Assuming 'r' = 1");
                                this.data.emission_material[R_INDEX] = 1;
                            }
                            if (this.validate_RGB(green)) this.data.emission_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in emission component. Assuming 'g' = 1");
                                this.data.emission_material[G_INDEX] = 1;
                            }
                            if (this.validate_RGB(blue)) this.data.emission_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in emission component. Assuming 'b' = 1");
                                this.data.emission_material[B_INDEX] = 1;
                            }
                            if (this.validate_RGB(alpha)) this.data.emission_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in emission component. Assuming 'a' = 1");
                                this.data.emission_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "ambient") {
                            if (this.validate_RGB(red)) this.data.ambient_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in ambient component. Assuming 'r' = 1");
                                this.data.ambient_material[R_INDEX] = 1;
                            }
                            if (this.validate_RGB(green)) this.data.ambient_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in ambient component. Assuming 'g' = 1");
                                this.data.ambient_material[G_INDEX] = 1;
                            }
                            if (this.validate_RGB(blue)) this.data.ambient_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in ambient component. Assuming 'b' = 1");
                                this.data.ambient_material[B_INDEX] = 1;
                            }
                            if (this.validate_RGB(alpha)) this.data.ambient_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in ambient component. Assuming 'a' = 1");
                                this.data.ambient_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "diffuse") {
                            if (this.validate_RGB(red)) this.data.diffuse_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in diffuse component. Assuming 'r' = 1");
                                this.data.diffuse_material[R_INDEX] = 1;
                            }
                            if (this.validate_RGB(green)) this.data.diffuse_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in diffuse component. Assuming 'g' = 1");
                                this.data.diffuse_material[G_INDEX] = 1;
                            }
                            if (this.validate_RGB(blue)) this.data.diffuse_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in diffuse component. Assuming 'b' = 1");
                                this.data.diffuse_material[B_INDEX] = 1;
                            }
                            if (this.validate_RGB(alpha)) this.data.diffuse_material[A_INDEX] = alpha;
                            else {
                                this.onXMLMinorError("Unable to parse alpha in diffuse component. Assuming 'a' = 1");
                                this.data.diffuse_material[A_INDEX] = 1;
                            }
                        }
                        if (grandChildren[i].nodeName == "specular") {
                            if (this.validate_RGB(red)) this.data.specular_material[R_INDEX] = red;
                            else {
                                this.onXMLMinorError("Unable to parse color red in specular component. Assuming 'r' = 1");
                                this.data.specular_material[R_INDEX] = 1;
                            }
                            if (this.validate_RGB(green)) this.data.specular_material[G_INDEX] = green;
                            else {
                                this.onXMLMinorError("Unable to parse color green in specular component. Assuming 'g' = 1");
                                this.data.specular_material[G_INDEX] = 1;
                            }
                            if (this.validate_RGB(blue)) this.data.specular_material[B_INDEX] = blue;
                            else {
                                this.onXMLMinorError("Unable to parse color blue in specular component. Assuming 'b' = 1");
                                this.data.specular_material[B_INDEX] = 1;
                            }
                            if (this.validate_RGB(alpha)) this.data.specular_material[A_INDEX] = alpha;
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

}