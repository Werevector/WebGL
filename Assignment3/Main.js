"use strict"

var gl;

var keyboardState = [];

var keyboardStateX = new THREEx.KeyboardState();

var time = 0;
var tDelta;

var camera;
var cameraSpeed = 30;

var cubeData;

var scene = new SceneNode(null);
var cubeNode;
var cubeNode2;

var projectionMat;
var projectionMatLoc;
var viewMat;
var viewMatLoc;

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

    gl.enable(gl.DEPTH_TEST);

    //Set the viewport
    gl.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);



    camera = new Camera();
    camera.position[2] = -5;
    camera.position[1] = 0;

    cubeData = new ShadedCube();


    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

    projectionMat = perspective(70, browserCanvas.width / browserCanvas.height, 0.01, 1000);
    viewMat = camera.getCameraView(tDelta);

    window.onkeydown = function(e) {
      keyboardState[e.keyCode || e.which] = true;
    };
    window.onkeyup = function(e) {
      keyboardState[e.keyCode || e.which] = false;
    };

    //Load Shaders
    var program = initShaders(gl,
      "vertex-shader",
      "fragment-shader"
    );
    //Initialize atribute buffers
    gl.useProgram(program);

    // Create the buffers for the object
    var cubeVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeData.points), gl.STATIC_DRAW );

    var cubeNBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeData.surfaceNormals), gl.STATIC_DRAW );

    //------------------------------------------------------------------------

    var ColorLocation = gl.getUniformLocation(program, "Color");
    var WorldMatLocation = gl.getUniformLocation(program, "WorldMatrix");

    viewMatLoc = gl.getUniformLocation(program, "viewMat");
    projectionMatLoc = gl.getUniformLocation(program, "projectionMat");

    var ambientProductLoc   = gl.getUniformLocation(program, "ambientProduct");
    var diffuseProductLoc   = gl.getUniformLocation(program, "diffuseProduct");
    var specularProductLoc  = gl.getUniformLocation(program, "specularProduct");
    var lightPositionLoc    = gl.getUniformLocation(program, "lightPosition");
    var shininessLoc        = gl.getUniformLocation(program, "shininess");

    cubeNode = new SceneNode(scene);
    cubeNode.addDrawable(
    {
      bufferInfo:
      {
        vBuffer: cubeVBuffer,
        nBuffer: cubeNBuffer,
        numVertices: 36
      },
      // Will be uploaded as uniforms

      programInfo:
      {
        program: program,
        worldMatLocation: WorldMatLocation,
        colorLocation: ColorLocation,
        ambientProduct: ambientProductLoc,
        diffuseProduct: diffuseProductLoc,
        specularProduct: specularProductLoc,
        lightPosition: lightPositionLoc,
        shininess: shininessLoc
      },

      uniformInfo:
      {
        color: vec4(0, 1, 1, 1),

        lm_Vars: new function()
        {
          this.lightPosition =  vec4(0.0, 0.0, 1.0, 1.0 );
          this.lightAmbient =   vec4(0.2, 0.2, 0.2, 1.0 );
          this.lightDiffuse =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

          this.materialAmbient =    vec4( 1.0, 0.0, 1.0, 1.0 );
          this.materialDiffuse =    vec4( 1.0, 0.8, 0.0, 1.0);
          this.materialSpecular =   vec4( 1.0, 0.8, 0.0, 1.0 );
          this.materialShininess =  100.0;

          this.ambientProduct =   mult(this.lightAmbient, this.materialAmbient);
          this.diffuseProduct =   mult(this.lightDiffuse, this.materialDiffuse);
          this.specularProduct =  mult(this.lightSpecular, this.materialSpecular);
        }
      }
    });

    cubeNode2 = new SceneNode(cubeNode);
    cubeNode2.translate([2.0,0.0,0.0]);

    cubeNode2.addDrawable(
    {
      bufferInfo:
      {
        vBuffer: cubeVBuffer,
        nBuffer: cubeNBuffer,
        numVertices: 36
      },
      // Will be uploaded as uniforms

      programInfo:
      {
        program: program,
        worldMatLocation: WorldMatLocation,
        colorLocation: ColorLocation,
        ambientProduct: ambientProductLoc,
        diffuseProduct: diffuseProductLoc,
        specularProduct: specularProductLoc,
        lightPosition: lightPositionLoc,
        shininess: shininessLoc
      },

      uniformInfo:
      {
        color: vec4(0, 1, 1, 1),

        lm_Vars: new function()
        {
          this.lightPosition =  vec4(0.0, 0.0, 0.0, 1.0 );
          this.lightAmbient =   vec4(0.2, 0.2, 0.2, 1.0 );
          this.lightDiffuse =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

          this.materialAmbient =    vec4( 1.0, 0.0, 1.0, 1.0 );
          this.materialDiffuse =    vec4( 1.0, 0.8, 0.0, 1.0);
          this.materialSpecular =   vec4( 1.0, 0.8, 0.0, 1.0 );
          this.materialShininess =  100.0;

          this.ambientProduct =   mult(this.lightAmbient, this.materialAmbient);
          this.diffuseProduct =   mult(this.lightDiffuse, this.materialDiffuse);
          this.specularProduct =  mult(this.lightSpecular, this.materialSpecular);
        }
      }
    });


    //-------------------------------------------------

    viewMatLoc = gl.getUniformLocation(program, "viewMat");
    projectionMatLoc = gl.getUniformLocation(program, "projectionMat");
    gl.uniformMatrix4fv(projectionMatLoc,  false, flatten(projectionMat));
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));
    //-------------------------------------------------------------------------

    render();
  }

  //Render the whole thing
  function render() {
    resize();
    HandleKeyboardState();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Update the clock
    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;
    //---------------

    var drawableObjects = SceneNode.getDrawableNodes();

    cubeNode.rotateSelf(1, [0,1,0]);
    cubeNode2.rotate(1, [0,1,0]);
    cubeNode2.rotateSelf(2, [0,1,0]);


    scene.updateMatrices();

    viewMat = camera.getCameraView(tDelta);
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));

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
      projectionMat = perspective(45, ratio, 0.1, 1000);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    init: init
  }
})();
