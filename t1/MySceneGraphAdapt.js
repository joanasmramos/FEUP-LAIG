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
//var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
//var COMPONENTS_INDEX = 8;

// pra que é isto?
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
        var translateTag, scaleTag;
        var vector, axis, angle;

        for (let i = 0; i < transformation.length; i++) {
            id = this.reader.getString(transformation[i], "id", true);

            if (!(this.verifyString(id) || this.data.transformations[id] != null))
                return "<transformations> - something wrong with the transformation id";

            this.data.transformations[id] = new Object();
            var exact_transformation = transformation[i].children;


            if (exact_transformation.length == 0) {
                return "a transformation needs to have an effective action (translate/rotate/scale)";
            }
            else {

                this.data.transformations[id] = mat4.create();
                //creating identitymatrix

                for (let j = 0; j < exact_transformation.length; i++) {

                    switch (exact_transformation.nodeName[j]) {
                        case "translate":
                            translateTag = exact_transformation.getElementsByTagName("translate")[0];
                            vector = this.readXYZ(translateTag);

                            mat4.translate(identMatrix, identMatrix, vector);
                            break;
                        case "rotate":
                            rotateTag = exact_transformation.getElementsByTagName("rotate")[0];
                            axis = this.reader.getString(exact_transformation.nodeName[j], 'axis', true);
                            angle = this.reader.getFloat(exact_transformation.nodeName[j], 'angle', true);
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

                            vector = vec3.set(vector, axis, angle);
                            mat4.rotate(identMatrix, identMatrix, DEGREE_TO_RAD * angle, vector);
                            break;
                        case "scale":
                            scaleTag = exact_transformation.getElementsByTagName("scale")[0];
                            vector = this.readXYZ(scaleTag);

                            mat4.scale(identMatrix, identMatrix, vector);
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
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */

    parseMaterials(materialsNode) {
        var material = materialsNode.getElementsByTagName('material');

        if (material.length == 0)
            return "You must define an material in the <materials> tag";

        var id;
        var emissionTag, ambientTag, diffuseTag, specularTag;

        for (let i = 0; i < material.length; i++) {
            id = this.reader.getString(material[i], "id", true);

            if (!this.verifyString(id) || this.data.materials[id] != null)
                return "<materials> - something wrong with materials' id";
            this.data.materials[id] = new Object();
            this.data.materials[id].shininess = this.reader.getFloat(material[i], 'shininess', true);

            if (!this.verifyString(this.data.materials[id]))
                return "<materials> - something wrong with materials' id";

            if (!this.verifyStringsFloats([], [this.data.materials[id].shininess]))
                return "<materials> - something wrong with materials's attributes";


            emissionTag = material[id].getElementsByTagName('emission')[0];
            ambientTag = material[id].getElementsByTagName('ambient')[0];
            diffuseTag = material[id].getElementsByTagName("diffuse")[0];
            specularTag = material[id].getElementsByTagName("specular")[0];


            if (!this.verifyElems([emissionTag, ambientTag, diffuseTag, specularTag]))
                return "<materials> - something wrong with material children";


            this.data.materials[id].emission = this.readRGBA(emissionTag);
            this.data.materials[id].ambient = this.readRGBA(ambientTag);
            this.data.materials[id].diffuse = this.readRGBA(diffuseTag);
            this.data.materials[id].specular = this.readRGBA(specularTag);

            if (!this.validateRGBAs([this.data.materials[id].emission, this.data.materials[id].ambient, this.data.materials[id].diffuse, this.data.materials[id].specular]))
                return "<materials> - something wrong with material's rgb values";
        }

        this.log("Parsed materials");
        return null;
    }

    /**
         * Parses the <primitives> node.
         * @param {primitives block element} 
         */
    parsePrimitives(primitivesNode) {

        var primitive = primitivesNode.getElementsByTagName('primitive');
        if (primitive.length == 0)
            return "You must define an material in the <primitives> tag";

        var id;
        var rectangleTag, triangleTag, cylinderTag, sphereTag, torusTag;

        for (let i = 0; i < primitive.length; i++) {
            var children = primitive[i].children;
            id = this.reader.getString(primitive[i], "id", true);

            if (!this.verifyString(id) || this.data.materials[id] != null)
                return "<primitives> - something wrong with primitives' id";
            this.data.primitives[id] = new Object();

            if (!this.verifyString(this.data.primitives[id]))
                return "<primitives> - something wrong with primitives' id";
            
            if(children.length > 1)
                return "You can only define 1 primitive per block."

            //ISTO NAO ESTÁ BEM
            switch (children[0].nodeName) {
                case 'rectangle':
                    rectangleTag = primitive[id].getElementsByTagName('rectangle')[0];

                    if (!this.verifyElems([rectangleTag]))
                        return "<primitives> - something wrong with primitives children";

                    this.data.primitives[id].rectangle = this.readRectanglearray(rectangleTag);
                    if (!this.verifyAssocArr(this.data.primitives[id].rectangle))
                        return "<primitives> - something wrong with rectangles's x1y1x2y2 values";

                    //TODO: CRIAR FUNÇÃO PARA ASSOCIAR AO DISPLAY E CRIAR O OBJETO
                    break;

                case 'triangle':
                    triangleTag = primitive[id].getElementsByTagName('triangle')[0];

                    if (!this.verifyElems([triangleTag]))
                        return "<primitives> - something wrong with primitives children";

                    this.data.primitives[id].triangle = this.readTrianglearray(triangleTag);
                    if (!this.verifyAssocArr(this.data.primitives[id].triangle))
                        return "<primitives> - something wrong with triangles's x1;y1;z1;x2;y2;z2;x3;y3,z3 values";

                    //TODO: CRIAR FUNÇÃO PARA ASSOCIAR AO DISPLAY E CRIAR O OBJETO
                    break;

                case 'cylinder':
                    cylinderTag = primitive[id].getElementsByTagName('cylinder')[0];

                    if (!this.verifyElems([cylinderTag]))
                        return "<primitives> - something wrong with primitives children";

                    this.data.primitives[id].cylinder = this.readCylinderarray(cylinderTag);
                    if (!this.verifyAssocArr(this.data.primitives[id].cylinder))
                        return "<primitives> - something wrong with cylinder's base;top;height;slices;stacks' values";

                    //TODO: CRIAR FUNÇÃO PARA ASSOCIAR AO DISPLAY E CRIAR O OBJETO-
                    break;

                case 'sphere':
                    sphereTag = primitive[id].getElementsByTagName('sphere')[0];

                    if (!this.verifyElems([sphereTag]))
                        return "<primitives> - something wrong with primitives children";

                    this.data.primitives[id].sphere = this.readSpherearray(sphereTag);
                    if (!this.verifyAssocArr(this.data.primitives[id].sphere))
                        return "<primitives> - something wrong with spheres's radius;slices;stacks values";


                    //TODO: CRIAR FUNÇÃO PARA ASSOCIAR AO DISPLAY E CRIAR O OBJETO
                    break;

                case 'torus':
                    torusTag = primitive[id].getElementsByTagName('torus')[0];

                    if (!this.verifyElems([torusTag]))
                        return "<primitives> - something wrong with primitives children";

                    this.data.primitives[id].torus = this.readTorusarray(torusTag);
                    if (!this.verifyAssocArr(this.data.primitives[id].torus))
                        return "<primitives> - something wrong with torus's inner;outer;slices;loops' values";

                    //TODO: CRIAR FUNÇÃO PARA ASSOCIAR AO DISPLAY E CRIAR O OBJETO
                    break;

                default:
                    break;

            }

        }

        this.log("Parsed primitives");
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

