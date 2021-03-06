"use strict"

// camera = new Camera();
// camera.position[2] = 0;
// camera.position[1] = 0;
// viewMatrix = camera.getCameraView(tDelta);

var gl;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    // Use this object to listen for key inputs
    var keyboardState = new THREEx.KeyboardState();

    // The camera object control's the position and orientation of the... camera
    var camera = new Camera();

    // Create the root SceneNode of the scene graph.
    var scene = new SceneNode(null);

    //
    // Set up our models
    //

    camera.position[2] = -5;
    camera.position[1] = 0;

    // camera.setPosition(vec3(0, 5, 10));
    // camera.forwardDirection = subtract(vec3(0,0,-1), camera.position);

    //var Projection = ortho(-10, 10, -10, 10, -10, 10);
    var Projection = perspective(60, canvas.width/canvas.height, 0.01, 1000);
    var View = camera.getCameraView(0.001);


    // SCENE GRAPH CODE

    //Create the sphere and add it to the scene graph
    var sphereData = generateSphere(16, 16);
    var sphereNode1 = new SceneNode(scene);	// scene as parent
    sphereNode1.scale([0.5,0.5,0.5]); // Make it half the size of sphereNode1

    // Create another sphereNode using the same data, and set it as a child of the first sphere
    var sphereNode2 = new SceneNode(sphereNode1);
    sphereNode2.translate([6,0,0]); // Translate relative to sphereNode 1.
    sphereNode2.scale([0.5,0.5,0.5]); // Make it half the size of sphereNode1


    //
    //  Configure WebGL
    //

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var ModelViewProjectionLocation = gl.getUniformLocation(program, "ModelViewProjection");
    var ColorLocation = gl.getUniformLocation(program, "Color");
    var WorldMatLocation = gl.getUniformLocation(program, "WorldMatrix");

    /* Load the data into the GPU in 2 separate buffers*/

    var buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(sphereData.points)), gl.STATIC_DRAW);

    var buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(sphereData.points)), gl.STATIC_DRAW);


    //
    // Add drawinfo to the SceneNodes
    //

    sphereNode1.addDrawable({
    	bufferInfo: {
        	buffer: buffer1,
        	numVertices: sphereData.numVertices
		},
        // Will be uploaded as uniforms
        uniformInfo: {
            color: vec4(0, 1, 1, 1)
        },
        programInfo: {
        	program: program,
            worldMatLocation: WorldMatLocation,
            colorLocation: ColorLocation
        }
    });

    sphereNode2.addDrawable({
    	bufferInfo: {
        	buffer: buffer2,
        	numVertices: sphereData.numVertices
		  },
        // Will be uploaded as uniforms
        uniformInfo: {
            color: vec4(0, 1, 0, 1)
        },
        programInfo: {
        	program: program,
            worldMatLocation: WorldMatLocation,
            colorLocation: ColorLocation
        }
    });


    //
    // Set up and start the render loop
    //

    var prevTimestamp = 0;

    window.requestAnimationFrame(function step(timestamp) {
        var deltaTimestamp = timestamp - prevTimestamp;
        prevTimestamp = timestamp;

        var seconds = timestamp/1000;
        var diffSeconds = deltaTimestamp/1000;



        View = camera.getCameraView(diffSeconds*10);
        var MVP = mult(Projection, View);


        sphereNode1.rotateSelf((3600/60*diffSeconds), [0,1,0]);
        sphereNode2.rotateSelf((36000/60*diffSeconds), [0,1,0]);
        sphereNode2.rotate((3600/60*diffSeconds), [0,1,0]);

        // Update the world matrices of the entire scene graph (Since we are starting at the root node).
        scene.updateMatrices();

        render(SceneNode.getDrawableNodes(), ModelViewProjectionLocation, ColorLocation, WorldMatLocation, MVP);

        window.requestAnimationFrame(step);
    });

}

function render(drawableObjects, mvpLocation, colorLocation, worldMatLocation, MVP) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(mvpLocation, false, flatten(MVP));

    drawableObjects.forEach(function(object) {
        renderDrawable(object); // Render a drawable.
    });
}
