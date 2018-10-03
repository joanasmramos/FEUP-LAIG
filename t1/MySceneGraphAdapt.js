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
/*var MATERIALS_INDEX = 5;
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
        if(str != "" && this.verifyElement(str))
            return true;
        return false;
    }

    /**
     * Verifies if a string is valid and equal to another
     * @param {string to verify} str
     * @param {string to compare with} strModel
     */
    verifyStringEqual(str, strModel) {
        if(this.verifyString(str) && str == strModel) 
            return true;
        return false;
    }

    /**
     * Verifies if a float is valid
     * @param {float to verify} fl
     */
    verifyFloat(fl) {
        if(this.verifyElement(fl) && !isNaN(fl))
            return true;
        return false;
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        var errorRoot = !this.verifyStringEqual(rootElement.nodeName, "yas");

        if(errorRoot) 
            return "Something wrong with tag <yas>";
        

        var rootChildren = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < rootChildren.length; i++) {
            nodeNames.push(rootChildren[i].nodeName);
        }

        // Processes each node, verifying errors.

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
        var children = viewsNode.children;

        if (children.length == 0)
            return "You must define a perspective/ortho view in the <views> tag";

        var idp, near, far, angle, from, to;
        var valid=false;

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

        this.data.defaultView = this.reader.getString(viewsNode, 'default');
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
                if (children[i].nodeName == "ambient") {
                    red = children[i].getAttribute("r");
                    green = children[i].getAttribute("g");
                    blue = children[i].getAttribute("b");
                    alpha = children[i].getAttribute("a");

                    if (red != null) {
                        if (isNaN(red)) return "red RGBA property of ambient component('r') is a non numeric value";
                        else if (red < 0 || red > 1) return "red RGBA property of ambient component('r') is out of bounds [0<r<1]";
                        else
                            this.data.ambientComponent[R_INDEX] = red;
                    } else return "red RGBA property of ambient component('r') is empty, assuming 'r' = 0";
                    if (green != null) {
                        if (isNaN(green)) return "green RGBA property of ambient component('g') is a non numeric value";
                        else if (green < 0 || green > 1) return "green RGBA property of ambient component('g') is out of bounds [0<g<1]";
                        else
                            this.data.ambientComponent[G_INDEX] = green;
                    } else return "green RGBA property of ambient component('g') is empty, assuming 'g' = 0";
                    if (blue != null) {
                        if (isNaN(blue)) return "blue RGBA property of ambient component('b') is a non numeric value";
                        else if (blue < 0 || blue > 1) return "blue RGBA property of ambient component('b') is out of bounds [0<b<1]";
                        else
                            this.data.ambientComponent[B_INDEX] = blue;
                    } else return "blue RGBA property of ambient component('b') is empty, assuming 'b' = 0";
                    if (alpha != null) {
                        if (isNaN(alpha)) return "alpha RGBA property of ambient component('a') is a non numeric value";
                        else if (alpha < 0 || alpha > 1) return "alpha RGBA property of ambient component('a') is out of bounds [0<a<1]";
                        else
                            this.data.ambientComponent[A_INDEX] = alpha;
                    } else return "alpha RGBA property of ambient component('a') is empty, assuming 'a' = 1";

                }
                if (children[i].nodeName == "background") {
                    red = children[i].getAttribute("r");
                    green = children[i].getAttribute("g");
                    blue = children[i].getAttribute("b");
                    alpha = children[i].getAttribute("a");

                    if (red != null) {
                        if (isNaN(red)) return "red RGBA property of background component('r') is a non numeric value";
                        else if (red < 0 || red > 1) return "red RGBA property of background component('r') is out of bounds [0<r<1]";
                        else
                            this.data.backgroundComponent[R_INDEX] = red;
                    } else return "red RGBA property of background component('r') is empty, assuming 'r' = 0";
                    if (green != null) {
                        if (isNaN(green)) return "green RGBA property of background component('g') is a non numeric value";
                        else if (green < 0 || green > 1) return "green RGBA property of background component('g') is out of bounds [0<g<1]";
                        else
                            this.data.backgroundComponent[G_INDEX] = green;
                    } else return "green RGBA property of background component('g') is empty, assuming 'g' = 0";
                    if (blue != null) {
                        if (isNaN(blue)) return "blue RGBA property of background component('b') is a non numeric value";
                        else if (blue < 0 || blue > 1) return "blue RGBA property of background component('b') is out of bounds [0<b<1]";
                        else
                            this.data.backgroundComponent[B_INDEX] = blue;
                    } else return "blue RGBA property of background component('b') is empty, assuming 'b' = 0";
                    if (alpha != null) {
                        if (isNaN(alpha)) return "alpha RGBA property of background component('a') is a non numeric value";
                        else if (alpha < 0 || alpha > 1) return "alpha RGBA property of background component('a') is out of bounds [0<a<1]";
                        else
                            this.data.backgroundComponent[A_INDEX] = alpha;
                    } else return "alpha RGBA property of background component('a') is empty, assuming 'a' = 1";

                }
            }
        }

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

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

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
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

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component

            // TODO: Retrieve the specular component

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

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
                    this.id_material = this.reader.getString(materialsNode, 'id');
                    this.shininess_material = this.reader.getFloat(materialsNode, 'shininess');

                    if (!(this.id_material != null && this.id_material != "")) {
                        return "ID for material in <materials> tag  is empty";
                    } else this.data.id_material = id_material;

                    if (!(this.shininess_material != null && !isNaN(this.shininess_material))) {
                        this.shininess_material = 1;
                        this.data.shininess_material = shininess_material;
                        this.onXMLMinorError("unable to parse value for shininess; assuming shininess = 1");
                    }
                    for (let i = 0; i < grandChildren.length; i++) {
                        if (grandChildren[i].nodeName == "emission") {
                            red = grandChildren[i].getAttribute("r");
                            green = grandChildren[i].getAttribute("g");
                            blue = grandChildren[i].getAttribute("b");
                            alpha = grandChildren[i].getAttribute("a");

                            if (red != null) {
                                if (isNaN(red)) return "red RGBA property of emission component('r') is a non numeric value";
                                else if (red < 0 || red > 1) return "red RGBA property of emission component('r') is out of bounds [0<r<1]";
                                else
                                    this.data.emission_material[R_INDEX] = red;
                            } else return "red RGBA property of emission component('r') is empty, assuming 'r' = 0";
                            if (green != null) {
                                if (isNaN(green)) return "green RGBA property of emission component('g') is a non numeric value";
                                else if (green < 0 || green > 1) return "green RGBA property of emission component('g') is out of bounds [0<g<1]";
                                else
                                    this.data.emission_material[G_INDEX] = green;
                            } else return "green RGBA property of emission component('g') is empty, assuming 'g' = 0";
                            if (blue != null) {
                                if (isNaN(blue)) return "blue RGBA property of emission component('b') is a non numeric value";
                                else if (blue < 0 || blue > 1) return "blue RGBA property of emission component('b') is out of bounds [0<b<1]";
                                else
                                    this.data.emission_material[B_INDEX] = blue;
                            } else return "blue RGBA property of emission component('b') is empty, assuming 'b' = 0";
                            if (alpha != null) {
                                if (isNaN(alpha)) return "alpha RGBA property of emission component('a') is a non numeric value";
                                else if (alpha < 0 || alpha > 1) return "alpha RGBA property of emission component('a') is out of bounds [0<a<1]";
                                else
                                    this.data.emission_material[A_INDEX] = alpha;
                            } else return "alpha RGBA property of emission component('a') is empty, assuming 'a' = 1";
                        }
                        if (grandChildren[i].nodeName == "ambient") {
                            red = grandChildren[i].getAttribute("r");
                            green = grandChildren[i].getAttribute("g");
                            blue = grandChildren[i].getAttribute("b");
                            alpha = grandChildren[i].getAttribute("a");

                            if (red != null) {
                                if (isNaN(red)) return "red RGBA property of ambient component('r') is a non numeric value";
                                else if (red < 0 || red > 1) return "red RGBA property of ambient component('r') is out of bounds [0<r<1]";
                                else
                                    this.data.ambient_material[R_INDEX] = red;
                            } else return "red RGBA property of ambient component('r') is empty, assuming 'r' = 0";
                            if (green != null) {
                                if (isNaN(green)) return "green RGBA property of ambient component('g') is a non numeric value";
                                else if (green < 0 || green > 1) return "green RGBA property of ambient component('g') is out of bounds [0<g<1]";
                                else
                                    this.data.ambient_material[G_INDEX] = green;
                            } else return "green RGBA property of ambient component('g') is empty, assuming 'g' = 0";
                            if (blue != null) {
                                if (isNaN(blue)) return "blue RGBA property of ambient component('b') is a non numeric value";
                                else if (blue < 0 || blue > 1) return "blue RGBA property of ambient component('b') is out of bounds [0<b<1]";
                                else
                                    this.data.ambient_material[B_INDEX] = blue;
                            } else return "blue RGBA property of ambient component('b') is empty, assuming 'b' = 0";
                            if (alpha != null) {
                                if (isNaN(alpha)) return "alpha RGBA property of ambient component('a') is a non numeric value";
                                else if (alpha < 0 || alpha > 1) return "alpha RGBA property of ambient component('a') is out of bounds [0<a<1]";
                                else
                                    this.data.ambient_material[A_INDEX] = alpha;
                            } else return "alpha RGBA property of ambient component('a') is empty, assuming 'a' = 1";
                        }
                        if (grandChildren[i].nodeName == "diffuse") {
                            red = grandChildren[i].getAttribute("r");
                            green = grandChildren[i].getAttribute("g");
                            blue = grandChildren[i].getAttribute("b");
                            alpha = grandChildren[i].getAttribute("a");

                            if (red != null) {
                                if (isNaN(red)) return "red RGBA property of diffuse component('r') is a non numeric value";
                                else if (red < 0 || red > 1) return "red RGBA property of diffuse component('r') is out of bounds [0<r<1]";
                                else
                                    this.data.diffuse_material[R_INDEX] = red;
                            } else return "red RGBA property of diffuse component('r') is empty, assuming 'r' = 0";
                            if (green != null) {
                                if (isNaN(green)) return "green RGBA property of diffuse component('g') is a non numeric value";
                                else if (green < 0 || green > 1) return "green RGBA property of diffuse component('g') is out of bounds [0<g<1]";
                                else
                                    this.data.diffuse_material[G_INDEX] = green;
                            } else return "green RGBA property of diffuse component('g') is empty, assuming 'g' = 0";
                            if (blue != null) {
                                if (isNaN(blue)) return "blue RGBA property of diffuse component('b') is a non numeric value";
                                else if (blue < 0 || blue > 1) return "blue RGBA property of diffuse component('b') is out of bounds [0<b<1]";
                                else
                                    this.data.diffuse_material[B_INDEX] = blue;
                            } else return "blue RGBA property of diffuse component('b') is empty, assuming 'b' = 0";
                            if (alpha != null) {
                                if (isNaN(alpha)) return "alpha RGBA property of diffuse component('a') is a non numeric value";
                                else if (alpha < 0 || alpha > 1) return "alpha RGBA property of diffuse component('a') is out of bounds [0<a<1]";
                                else
                                    this.data.diffuse_material[A_INDEX] = alpha;
                            } else return "alpha RGBA property of diffuse component('a') is empty, assuming 'a' = 1";
                        }
                        if (grandChildren[i].nodeName == "specular") {
                            red = grandChildren[i].getAttribute("r");
                            green = grandChildren[i].getAttribute("g");
                            blue = grandChildren[i].getAttribute("b");
                            alpha = grandChildren[i].getAttribute("a");

                            if (red != null) {
                                if (isNaN(red)) return "red RGBA property of specular component('r') is a non numeric value";
                                else if (red < 0 || red > 1) return "red RGBA property of specular component('r') is out of bounds [0<r<1]";
                                else
                                    this.data.specular_material[R_INDEX] = red;
                            } else return "red RGBA property of specular component('r') is empty, assuming 'r' = 0";
                            if (green != null) {
                                if (isNaN(green)) return "green RGBA property of specular component('g') is a non numeric value";
                                else if (green < 0 || green > 1) return "green RGBA property of specular component('g') is out of bounds [0<g<1]";
                                else
                                    this.data.specular_material[G_INDEX] = green;
                            } else return "green RGBA property of specular component('g') is empty, assuming 'g' = 0";
                            if (blue != null) {
                                if (isNaN(blue)) return "blue RGBA property of specular component('b') is a non numeric value";
                                else if (blue < 0 || blue > 1) return "blue RGBA property of specular component('b') is out of bounds [0<b<1]";
                                else
                                    this.data.specular_material[B_INDEX] = blue;
                            } else return "blue RGBA property of specular component('b') is empty, assuming 'b' = 0";
                            if (alpha != null) {
                                if (isNaN(alpha)) return "alpha RGBA property of specular component('a') is a non numeric value";
                                else if (alpha < 0 || alpha > 1) return "alpha RGBA property of specular component('a') is out of bounds [0<a<1]";
                                else
                                    this.data.specular_material[A_INDEX] = alpha;
                            } else return "alpha RGBA property of emission component('a') is empty, assuming 'a' = 1";
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
