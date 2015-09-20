"use strict"

var gl;

var viewMatrix;
var projectionMatrix;

var ModelViewProjectionLocation
var ColorLocation
var WorldMatLocation

var keyboardState = [];

var keyboardStateX = new THREEx.KeyboardState();

var time = 0;
var tDelta;

var scene;

var camera;
var cameraSpeed = 30;

var sphereData;
var cubeData;
var cylinderData

var sphereNode1;
var sphereNode2;
var jupiterNode;
var moonNode;
var stationNode;
var JmoonNode;
var JmoonNode2;


var main = (function() {

  var browserCanvas;

  function init() {

    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 600;
    browserCanvas.height = 600;

    //Create the OpenGL context, to be used in the program
    gl = WebGLUtils.setupWebGL(browserCanvas);
    if (!gl) {
      alert("WebGl isn't available");
    }

    camera = new Camera();
    camera.position[2] = -50;
    camera.position[1] = 10;

    scene = new SceneNode(null);

    gl.enable(gl.DEPTH_TEST);

    //Set the viewport
    gl.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    //Load Shaders
    var program = initShaders(gl,
      "vertex-shader",
      "fragment-shader"
    );

    //Initialize atrribute buffers
    gl.useProgram(program);

    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

    projectionMatrix = perspective(70, browserCanvas.width / browserCanvas.height, 0.01, 1000);
    viewMatrix = camera.getCameraView(tDelta);

    ModelViewProjectionLocation = gl.getUniformLocation(program, "ModelViewProjection");
    ColorLocation = gl.getUniformLocation(program, "Color");
    WorldMatLocation = gl.getUniformLocation(program, "WorldMatrix");


    sphereData = generateSphere(16, 16);
    cubeData = new generateCube();
    cylinderData = new generateCylinder(10);

    sphereNode1 = new SceneNode(scene);
    sphereNode1.scale([7,7,7]);

    sphereNode2 = new SceneNode(sphereNode1);
    sphereNode2.translate([20, 0, 0]);
    sphereNode2.scale([0.3, 0.3, 0.3]);

    jupiterNode = new SceneNode(sphereNode1);
    jupiterNode.translate([25,0,0]);
    jupiterNode.scale([0.5,0.5,0.5]);

    moonNode = new SceneNode(sphereNode2);
    moonNode.translate([10, 0, 0]);
    moonNode.scale([0.3,0.3,0.3]);

    stationNode = new SceneNode(moonNode);
    stationNode.translate([5, 0, 0]);
    stationNode.scale([0.5,0.5,0.5]);

    JmoonNode = new SceneNode(jupiterNode);
    JmoonNode.translate([6, 0, 0]);
    JmoonNode.scale([0.4,0.4,0.4]);

    JmoonNode2 = new SceneNode(jupiterNode);
    JmoonNode2.translate([20, 0, 0]);
    JmoonNode2.scale([0.2,0.2,0.2]);


    var buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(sphereData.points)), gl.STATIC_DRAW);

    var buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(sphereData.points)), gl.STATIC_DRAW);

    var cubeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(cubeData.points)), gl.STATIC_DRAW);

    var cylinderBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(cylinderData.points)), gl.STATIC_DRAW);

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

    moonNode.addDrawable({
      bufferInfo: {
        buffer: buffer2,
        numVertices: sphereData.numVertices
      },
      // Will be uploaded as uniforms
      uniformInfo: {
        color: vec4(0, 0, 0, 1)
      },
      programInfo: {
        program: program,
        worldMatLocation: WorldMatLocation,
        colorLocation: ColorLocation
      }
    });

    stationNode.addDrawable({
      bufferInfo: {
        buffer: cylinderBuffer,
        numVertices: cylinderData.numVertices
      },
      // Will be uploaded as uniforms
      uniformInfo: {
        color: vec4(0.3, 0.5, 1, 1)
      },
      programInfo: {
        program: program,
        worldMatLocation: WorldMatLocation,
        colorLocation: ColorLocation
      }
    });

    jupiterNode.addDrawable({
      bufferInfo: {
        buffer: buffer1,
        numVertices: sphereData.numVertices
      },
      // Will be uploaded as uniforms
      uniformInfo: {
        color: vec4(1, 1, 1, 1)
      },
      programInfo: {
        program: program,
        worldMatLocation: WorldMatLocation,
        colorLocation: ColorLocation
      }
    });

    JmoonNode.addDrawable({
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

    JmoonNode2.addDrawable({
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


    window.onkeydown = function(e) {
      keyboardState[e.keyCode || e.which] = true;
    };
    window.onkeyup = function(e) {
      keyboardState[e.keyCode || e.which] = false;
    };


    render();
  }

  //Render the whole thing
  function render() {
    resize();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

    HandleKeyboardState();


    viewMatrix = camera.getCameraView(tDelta);

    var MVP = mult(projectionMatrix, viewMatrix);

    var speed = 0.1;

    sphereNode1.rotateSelf((3600 / 60 * tDelta)*speed, [0, 1, 0]);
    sphereNode2.rotateSelf((3600 / 60 * tDelta*2)*speed, [0, 1, 0]);
    sphereNode2.rotate((3600 / 60 * tDelta*2)*speed, [0, 1, 0]);
    moonNode.rotate((3600 / 60 * tDelta*6)*speed, [0,1,0]);
    stationNode.rotateSelf((3600 / 60 * tDelta*100)*speed, [1, 0.5, 1]);
    stationNode.rotate((3600 / 60 * tDelta*20)*speed, [0,1,0]);
    jupiterNode.rotate((3600 / 60 * tDelta*1)*speed, [0,1,0]);
    jupiterNode.rotateSelf((3600 / 60 * tDelta*30)*speed, [0,1,0]);
    JmoonNode.rotate((3600 / 60 * tDelta*20)*speed, [0,1,0]);
    JmoonNode.rotateSelf((3600 / 60 * tDelta*2)*speed, [0, 1, 0]);
    JmoonNode2.rotate((3600 / 60 * tDelta*10)*speed, [0,1,0]);
    JmoonNode2.rotateSelf((3600 / 60 * tDelta*2)*speed, [0, 1, 0]);


    scene.updateMatrices();

    var drawableObjects = SceneNode.getDrawableNodes();

    gl.uniformMatrix4fv(ModelViewProjectionLocation, false, flatten(MVP));

    drawableObjects.forEach(function(object) {
      renderDrawable(object); // Render a drawable.
    });

    requestAnimFrame(render);
  }

  function HandleKeyboardState() {
    // W
    if (keyboardState[87]) {
      if (true) {
        camera.position = add(camera.position, scale(cameraSpeed * tDelta, camera.viewVector));

      }
    }
    // S
    if (keyboardState[83]) {
      if (true) {
        camera.position = subtract(camera.position, scale(cameraSpeed * tDelta, camera.viewVector));

      }
    }

    //A
    if (keyboardState[65]) {
      camera.position = subtract(camera.position, scale(cameraSpeed * tDelta, camera.right));

    }
    //D
    if (keyboardState[68]) {
      camera.position = add(camera.position, scale(cameraSpeed * tDelta, camera.right));
    }

    //Q
    if (keyboardState[81]) {
      if (true) {
        camera.viewAngle[2] -= camera.mouse.mouseSensitivity * tDelta;
      }
    }
    //E
    if (keyboardState[69]) {
      if (true) {
        camera.viewAngle[2] += camera.mouse.mouseSensitivity * tDelta;
      }
    }
  }

  function resize() {
    // Get the canvas from the WebGL context
    var canvas = gl.canvas;

    // Lookup the size the browser is displaying the canvas.
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      var ratio = displayWidth / displayHeight;
      projectionMatrix = perspective(45, ratio, 0.1, 1000);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    init: init
  }
})();
