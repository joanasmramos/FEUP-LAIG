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
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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

        this.nodes = new Object();
        this.nodeIds = [];
        this.idRoot = null;                    // The id of the root element.
        this.primitives = [];

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


        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(rootChildren[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(rootChildren[index])) != null)
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

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(rootChildren[index])) != null)
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

        var id, near, far, angle, left, right, top, bottom, from, to, up, fromTag, toTag;

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

            this.data.views[id] = new CGFcamera(DEGREE_TO_RAD * angle, near, far, from, to);
        }

        for (let i = 0; i < orthos.length; i++) {
            id = this.reader.getString(orthos[i], "id", true);

            if (!this.verifyString(id) || this.data.views[id] != null)
                return "views - something wrong with a ortho's id";

            near = this.reader.getFloat(orthos[i], "near", true);
            far = this.reader.getFloat(orthos[i], "far", true);
            left = this.reader.getFloat(orthos[i], "left", true);
            right = this.reader.getFloat(orthos[i], "right", true);
            top = this.reader.getFloat(orthos[i], "top", true);
            bottom = this.reader.getFloat(orthos[i], "bottom", true);
            fromTag = orthos[i].getElementsByTagName("from")[0];
            toTag = orthos[i].getElementsByTagName("to")[0];

            if (!this.verifyElems([fromTag, toTag]))
                return "<views> - something wrong with a ortho's from/to element";

            from = this.readXYZ(fromTag);
            to = this.readXYZ(toTag);            
            up = [0,1,0];

            if (!this.verifyStringsFloats([], [near, far, left, right, top, bottom, from[0], from[1], from[2], to[0], to[1], to[2],
            up[0], up[1], up[2]]))
                return "<views> - something wrong with a ortho's children values";

            this.data.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
        }

        this.data.defaultView = this.reader.getString(viewsNode, 'default', true);

        if (!this.verifyString(this.data.defaultView) || this.data.views[this.data.defaultView] == null)
            return "views - something wrong with orthos";

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
            this.data.spotLights[id].angle = DEGREE_TO_RAD * this.reader.getFloat(spot[i], 'angle', true);
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

        var id, file;
        for (let i = 0; i < textures.length; i++) {
            id = this.reader.getString(textures[i], 'id', true);

            if (!this.verifyString(id) || this.data.textures[id] != null)
                return "<textures> - something wrong with texture's id";

            file = this.reader.getString(textures[i], 'file', true);

            if (!this.verifyString(file))
            return "<textures> - something wrong with texture's file";

            this.data.textures[id] = new CGFtexture(this.scene, file);
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
            return "<transformations> - you must define at least one transformation in the <transformations> tag";

        var id;
        var vector, axis, angle;
        this.data.transformations = [];
        for (let i = 0; i < transformation.length; i++) { 

            id = this.reader.getString(transformation[i], "id", true);
            var children = transformation[i].children; //translates rotates scales

            if (!(this.verifyString(id) || this.data.transformations[id] != null))
                return "<transformations> - something wrong with the transformation id";

            if (children.length == 0) 
                return "<transformations> - a transformation needs to have an effective action (translate/rotate/scale)";

            var result = mat4.create();

            for(let j=0; j<children.length; j++) {
                switch (children[j].nodeName) {
                    case "translate":
                        vector = this.readXYZ(children[j]);
    
                        mat4.translate(result, result, vector);
                        //this.data.transformations[id].push(result);
                        break;
                    case "rotate":
                        axis = this.reader.getString(children[j], 'axis', true);
                        angle = this.reader.getFloat(children[j], 'angle', true);
                        switch (axis) {
                            case 'x':
                                axis = [1, 0, 0];
                                break;
                            case 'y':
                                axis = [0, 1, 0];
                                break;
    
                            case 'z':
                                axis = [0, 0, 1];
                                break;
                        }
    
                        vector = vec3.fromValues(axis[0], axis[1], axis[2]);
                        mat4.rotate(result, result, DEGREE_TO_RAD * angle, vector);
                        //this.data.transformations[id].push(result);
                        break;
                    case "scale":
                        vector = this.readXYZ(children[j]);
    
                        mat4.scale(result, result, vector);
                        //this.data.transformations[id].push(result);
                        break;
                    default:
                        break;
                }
            }

            this.data.transformations[id] = result;

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
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var material = materialsNode.getElementsByTagName('material');

        if (material.length == 0)
            return "You must define a material in the <materials> tag";

        var id;
        var emissionTag, ambientTag, diffuseTag, specularTag;

        for (let i = 0; i < material.length; i++) {
            id = this.reader.getString(material[i], "id", true);

            if (!this.verifyString(id) || this.data.materials[id] != null)
                return "<materials> - something wrong with materials' id";

            var shininess = this.reader.getFloat(material[i], 'shininess', true);


            if (!this.verifyFloat(shininess))
                return "<materials> - something wrong with materials's shininess";


            emissionTag = material[id].getElementsByTagName('emission')[0];
            ambientTag = material[id].getElementsByTagName('ambient')[0];
            diffuseTag = material[id].getElementsByTagName("diffuse")[0];
            specularTag = material[id].getElementsByTagName("specular")[0];


            if (!this.verifyElems([emissionTag, ambientTag, diffuseTag, specularTag]))
                return "<materials> - something wrong with material children";


            var emission = this.readRGBA(emissionTag);
            var ambient = this.readRGBA(ambientTag);
            var diffuse = this.readRGBA(diffuseTag);
            var specular = this.readRGBA(specularTag);

            if (!this.validateRGBAs([emission, ambient, diffuse, specular]))
                return "<materials> - something wrong with material's rgb values";

            this.data.materials[id] = new CGFappearance(this.scene);
            this.data.materials[id].setShininess(shininess);
            this.data.materials[id].setEmission(emission["r"], emission["g"], emission["b"], emission["a"]);
            this.data.materials[id].setAmbient(ambient["r"], ambient["g"], ambient["b"], ambient["a"]);
            this.data.materials[id].setDiffuse(diffuse["r"], diffuse["g"], diffuse["b"], diffuse["a"]);
            this.data.materials[id].setSpecular(specular["r"], specular["g"], specular["b"], specular["a"]);
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Reads x,y and z coordinates from a Rectangle element, returns associative array with xy_rect
     * @param {element} elem 
     */
    readRectanglearray(elem) {
        var xy_rect = [];

        xy_rect["x1"] = this.reader.getFloat(elem, "x1", true);
        xy_rect["y1"] = this.reader.getFloat(elem, "y1", true);
        xy_rect["x2"] = this.reader.getFloat(elem, "x2", true);
        xy_rect["y2"] = this.reader.getFloat(elem, "y2", true);

        return xy_rect;
    }

    /**
     * Reads radius, slices, stacks from a Sphere element, returns associative array with rss
     * @param {element} elem 
     */
    readSpherearray(elem) {
        var rss = [];

        rss["radius"] = this.reader.getFloat(elem, "radius", true);
        rss["slices"] = this.reader.getInteger(elem, "slices", true);
        rss["stacks"] = this.reader.getInteger(elem, "stacks", true);

        return rss;
    }

    /**
     * Reads x,y and z coordinates from a Triangle element, returns associative array with xyz_rect
     * @param {element} elem 
     */
    readTrianglearray(elem) {
        var xyz_rect = [];

        xyz_rect["x1"] = this.reader.getFloat(elem, "x1", true);
        xyz_rect["y1"] = this.reader.getFloat(elem, "y1", true);
        xyz_rect["z1"] = this.reader.getFloat(elem, "z1", true);
        xyz_rect["x2"] = this.reader.getFloat(elem, "x2", true);
        xyz_rect["y2"] = this.reader.getFloat(elem, "y2", true);
        xyz_rect["z2"] = this.reader.getFloat(elem, "z2", true);
        xyz_rect["x3"] = this.reader.getFloat(elem, "x3", true);
        xyz_rect["y3"] = this.reader.getFloat(elem, "y3", true);
        xyz_rect["z3"] = this.reader.getFloat(elem, "z3", true);

        return xyz_rect;
    }

    /**
     * Reads from a Cylinder element, returns associative array with components
     * @param {element} elem 
     */
    readCylinderarray(elem) {
        var bthss_cylinder = [];

        bthss_cylinder["base"] = this.reader.getFloat(elem, "base", true);
        bthss_cylinder["top"] = this.reader.getFloat(elem, "top", true);
        bthss_cylinder["height"] = this.reader.getFloat(elem, "height", true);
        bthss_cylinder["slices"] = this.reader.getInteger(elem, "slices", true);
        bthss_cylinder["stacks"] = this.reader.getInteger(elem, "stacks", true);


        return bthss_cylinder;
    }

    /**
    * Reads x,y and z coordinates from a Torus element, returns associative array with inner;outer;slices;stack
    * @param {element} elem 
    */
    readTorusarray(elem) {
        var torus_property = [];

        torus_property["inner"] = this.reader.getFloat(elem, "inner", true);
        torus_property["outer"] = this.reader.getFloat(elem, "outer", true);
        torus_property["slices"] = this.reader.getInteger(elem, "slices", true);
        torus_property["loops"] = this.reader.getInteger(elem, "loops", true);


        return torus_property;
    }

    /**
     * Parses the <primitives> node.
     * @param {primitives block element} 
     */
    parsePrimitives(primitivesNode) {

        var primitive = primitivesNode.getElementsByTagName('primitive');
        if (primitive.length == 0)
            return "You must define a primitive in the <primitives> tag";

        var id;
        var rectangleTag, triangleTag, cylinderTag, sphereTag, torusTag, circleTag;
        var rectangle = [], triangle = [], cylinder = [], sphere = [], torus = [], slices;

        for (let i = 0; i < primitive.length; i++) {
            var children = primitive[i].children;
            id = this.reader.getString(primitive[i], "id", true);

            if (!this.verifyString(id))
                return "<primitives> - something wrong with primitives' id";
            
            if(children.length > 1)
                return "You can only define 1 primitive per block."

            
            switch (children[0].nodeName) {
                case 'rectangle':
                    rectangleTag = primitive[id].getElementsByTagName('rectangle')[0];

                    if (!this.verifyElems([rectangleTag]))
                        return "<primitives> - something wrong with primitives children";

                    rectangle = this.readRectanglearray(rectangleTag);
                    if (!this.verifyAssocArr(rectangle))
                        return "<primitives> - something wrong with rectangles's x1y1x2y2 values";

                    if(this.primitives[id] != null) 
                        return "<primitives> - something wrong with primitive's id";
                    
                    this.primitives[id] = new MyRectangle(this.scene, rectangle["x1"], rectangle["y1"], rectangle["x2"], rectangle["y2"]); 
                    
                    break;

                case 'triangle':
                    triangleTag = primitive[id].getElementsByTagName('triangle')[0];

                    if (!this.verifyElems([triangleTag]))
                        return "<primitives> - something wrong with primitives children";

                    triangle = this.readTrianglearray(triangleTag);
                    if (!this.verifyAssocArr(triangle))
                        return "<primitives> - something wrong with triangles's x1;y1;z1;x2;y2;z2;x3;y3,z3 values";

                    if(this.primitives[id] != null) 
                        return "<primitves> - something wrong with primitive's id";
                    
                    //TO DO: MyTriangle (criar ficheiro)
                    
                    break;

                case 'cylinder':
                    cylinderTag = primitive[id].getElementsByTagName('cylinder')[0];

                    if (!this.verifyElems([cylinderTag]))
                        return "<primitives> - something wrong with primitives children";

                    cylinder = this.readCylinderarray(cylinderTag);
                    if (!this.verifyAssocArr(cylinder))
                        return "<primitives> - something wrong with cylinder's base;top;height;slices;stacks' values";
                    //semtampa
                    this.primitives[id] = new MyCylinder (this.scene, cylinder["base"], cylinder["top"], cylinder["height"], cylinder["slices"], cylinder["stacks"]);
                    
                    break;

                case 'sphere':
                    sphereTag = primitive[id].getElementsByTagName('sphere')[0];

                    if (!this.verifyElems([sphereTag]))
                        return "<primitives> - something wrong with primitives children";

                    sphere = this.readSpherearray(sphereTag);
                    if (!this.verifyAssocArr(sphere))
                        return "<primitives> - something wrong with spheres's radius;slices;stacks values";

                    if(this.primitives[id] != null) 
                        return "<primitves> - something wrong with primitive's id";

                    this.primitives[id] = new MySphere(this.scene, sphere["radius"],  sphere["slices"], sphere["stacks"]);
                    break;

                case 'torus':
                    torusTag = primitive[id].getElementsByTagName('torus')[0];

                    if (!this.verifyElems([torusTag]))
                        return "<primitives> - something wrong with primitives children";

                    torus = this.readTorusarray(torusTag);
                    if (!this.verifyAssocArr(torus))
                        return "<primitives> - something wrong with torus's inner;outer;slices;loops' values";


                    if(this.primitives[id] != null) 
                        return "<primitves> - something wrong with primitive's id";

                    this.primitives[id] = new MyTorus(this.scene, torus["inner"], torus["outer"], torus["slices"], torus["loops"]);

                    break;

                case circle:
                    circleTag = primitive[id].getElementsByTagName('circle')[0];

                    if(!this.verifyElement(circleTag))
                        return "<primitives> - something wrong with primitives children";

                    slices = this.reader.getInteger(elem, "slices", true);
                    if(!this.verifyFloat(slices))
                        return "<primitives> - something wrong with circle's slices";

                    if(this.primitives[id] != null)
                        return "<primitives> - something wrong with primitive's id";
                    
                    this.primitives[id] = new MyCircle(this.scene, slices);

                default:
                    break;

            }

        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses <transformation> block (<component>'s child)
     * @param {component's id} compId 
     * @param {transformation tag} transformationTag 
     */
    parseCompTransformation(compId,transformationTag) {
        var transformationref = transformationTag.getElementsByTagName("transformationref");
        var translate = transformationTag.getElementsByTagName("translate");
        var rotate = transformationTag.getElementsByTagName("rotate");
        var scale = transformationTag.getElementsByTagName("scale");

        if(transformationTag.children.length == 0)
            return;

        if((transformationref.length > 0 && (translate.length > 0 || rotate.length > 0 || scale.length > 0)) || transformationref.length > 1)
            return "<components> something wrong with component's transformations";

        if(transformationref.length > 0) {
            var id = this.reader.getString(transformationref[0], "id", true);

            if(this.data.transformations[id] == null)
                return "<components> no such transformation";
            
            this.nodes[compId].transformationMat = this.data.transformations[id];
        }
        else {
            var children = transformationTag.children;
            var result = mat4.create();

            for(let i=0; i<children.length; i++){
                switch(children[i].nodeName) {
                    case "translate":
                        var vector = this.readXYZ(children[i]);
    
                        mat4.translate(result, result, vector);
                        break;
                    case "rotate":
                        var axis = this.reader.getString(children[i], 'axis', true);
                        var angle = this.reader.getFloat(children[i], 'angle', true);
                        switch (axis) {
                            case 'x':
                                axis = [1, 0, 0];
                                break;
                            case 'y':
                                axis = [0, 1, 0];
                                break;
    
                            case 'z':
                                axis = [0, 0, 1];
                                break;
                        }
    
                        var vector = vec3.fromValues(axis[0], axis[1], axis[2]);
                        mat4.rotate(result, result, DEGREE_TO_RAD * angle, vector);
                        break;
                    case "scale":
                        vector = this.readXYZ(children[i]);
    
                        mat4.scale(result, result, vector);
                        break;
                    default:
                        break;
                }

            this.nodes[compId].transformationMat = result;
            }
        }
    }

    /**
     * Parses <materials> block (<component>'s child)
     * @param {component's id} compId 
     * @param {materials tag} materialsTag 
     */
    parseCompMaterials(compId, materialsTag) {
        var materials = materialsTag.getElementsByTagName('material'); // array com todas as <material> filhas de <materials>

        if(materials.length == 0)
            return "<components> - you must define at least one material";

        var id;

        for(let i=0; i<materials.length; i++) {
            id = this.reader.getString(materials[i], 'id', true);
            if(!this.verifyString(id) || this.data.materials[id] == null)
                if(id != "inherit")
                    return "<components> - something wrong with material's id";
                else {
                    this.nodes[compId].materials.push(id);
                    return;
                }
            this.nodes[compId].materials.push(this.data.materials[id]);
        }

    }

    /**
     * Parses <texture> block (<component>'s child)
     * @param {component's id} compId 
     * @param {texture tag} textureTag 
     */
    parseCompTexture(compId, textureTag) {
        var id, s, t;

        id = this.reader.getString(textureTag, 'id', true);
        if(!this.verifyString(id) || this.data.textures[id] == null) {
            if(id!="inherit" && id!="none")
                return "<components> - something wrong with texture's id";
            this.nodes[compId].texture = id;
            }
        else {
            this.nodes[compId].texture = this.data.textures[id];
        }
        s = this.reader.getFloat(textureTag, 'length_s', true);
        t = this.reader.getFloat(textureTag, 'length_t', true);

        if(!this.verifyStringsFloats([], [s, t]))
            return "<components> - somethings wrong with texture's length";

        this.nodes[compId].lengthS = s;
        this.nodes[compId].lengthT = t;
    }

    /**
     * Parses <children> block (<component>'s child)
     * @param {component's id} compId 
     * @param {children tag} childrenTag 
     */
    parseCompChildren(compId, childrenTag) {
        var componentref, primitiveref;

        componentref = childrenTag.getElementsByTagName('componentref');
        primitiveref = childrenTag.getElementsByTagName('primitiveref');

        if(componentref.length==0 && primitiveref.length == 0)
            return "<components> - your components must have children";

        for(let i=0; i<componentref.length; i++) {
            var id;

            id = this.reader.getString(componentref[i], 'id', true);
            if(!this.verifyString(id))
                return "<components> - something wrong with componentref's id";

            this.nodes[compId].componentref.push(id);
        }

        for(let i=0; i<primitiveref.length; i++) {
            var id;

            id=this.reader.getString(primitiveref[i], 'id', true);
            if(!this.verifyString(id))
                return "<components> - something wrong with primitiveref's id";

            if(this.primitives[id] == null)
                return "<components> - something wrong with primitiveref (there's no such primitive)";

            this.nodes[compId].primitiveref.push(id);
        }
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        var components = componentsNode.getElementsByTagName('component'); // array com todas as <component> filhas de <components>

        if(components.length == 0)
            return "<components> - you must define at least one component";

        var id;
        var transformationTag, materialsTag, textureTag, childrenTag;

        for(let i=0; i<components.length; i++){
            // id do component
            id = this.reader.getString(components[i], 'id', true);

            if(!this.verifyString(id) || this.nodes[id]!=null)
                return "<components> - something wrong with component's id";

            this.nodes[id] = new MySceneComponent();

            // component's children
            transformationTag = components[i].getElementsByTagName('transformation')[0];
            materialsTag = components[i].getElementsByTagName('materials')[0];
            textureTag = components[i].getElementsByTagName('texture')[0];
            childrenTag = components[i].getElementsByTagName('children')[0];

            if(!this.verifyElems([transformationTag, materialsTag, textureTag, childrenTag]))
                return "<components> - something wrong with component's children";

            var error = this.parseCompTransformation(id, transformationTag);
            if(error != null)
                return error;

            // <materials>
            error = this.parseCompMaterials(id, materialsTag);
            if(error != null)
                return error;

            // <texture>
            error = this.parseCompTexture(id, textureTag);
            if(error != null)
                return error;

            // <children>

            error = this.parseCompChildren(id, childrenTag);
            if(error != null)
                return error;
            

            for(let i=0; i<this.nodeIds.length; i++) {
                if(this.nodeIds[i] == id)
                    return "<components> - repeated id in a component";
            }

            this.nodeIds.push(id);
            
            var a = this.nodes[id];
            this.log("");
        }

        //TO DO: fazer verificação dos ids da children
        var root = false;
        for(let i=0; i<this.nodeIds.length; i++) {
            if(this.nodeIds[i] == this.idRoot)
                root = true;
        }
        if (!root)
            return "<components> - there's no such root"; 

        this.log("Parsed components");
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

    processComponent(comp, fatherMat, fatherTex) {
        var currentMat, currentTex;
        this.scene.pushMatrix();
      
        if(this.nodes[comp].transformationMat != null)
            this.scene.multMatrix(this.nodes[comp].transformationMat);
        

        switch(this.nodes[comp].materials[this.nodes[comp].defaultMaterial]){
            case "inherit":
                currentMat = fatherMat;
                break;
            default:
                currentMat = this.nodes[comp].materials[this.nodes[comp].defaultMaterial];
                break;
        }

        switch(this.nodes[comp].texture) {
            case "none":
                currentTex = null;
                break;
            case "inherit":
                currentTex = fatherTex;
                break;
            default:
                currentTex = this.nodes[comp].texture;
                break;
        }
    
        var primitiveChildren = this.nodes[comp].primitiveref;
        var componentChildren = this.nodes[comp].componentref;

        if(primitiveChildren.length>0) {
            for(let i=0; i<primitiveChildren.length; i++) {
                currentMat.setTexture(currentTex);

                if(this.primitives[primitiveChildren[i]] instanceof MyRectangle || this.primitives[primitiveChildren[i]] instanceof MyTriangle ){
                    this.primitives[primitiveChildren[i]].setTexCoords(this.nodes[comp].lengthS, this.nodes[comp].lengthT);
                }   

                currentMat.apply();
                this.primitives[primitiveChildren[i]].display();
            }
        }
            
        for(let i=0; i<componentChildren.length; i++) {
            this.processComponent(componentChildren[i], currentMat, currentTex);
        }

        this.scene.popMatrix();
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.nodes[this.idRoot].transformationMat = mat4.create();
        this.processComponent(this.idRoot, this.nodes[this.idRoot].materials[this.nodes[this.idRoot].defaultMaterial], this.nodes[this.idRoot].texture);
    }

}

