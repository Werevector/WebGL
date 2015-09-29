"use strict"

var gl;

var keyboardState = [];

var keyboardStateX = new THREEx.KeyboardState();

var time = 0;
var tDelta;

var camera;
var cameraSpeed = 30;

var program;

var cubeData;
var sphereData;

var scene = new SceneNode(null);
var cubeNode;
var marsNode;
var moonNode;

var projectionMat;
var projectionMatLoc;
var viewMat;
var viewMatLoc;

var textures = [];
var textureLoc;

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
    camera.position[2] = -10;
    camera.position[0] = 5;

    cubeData = new ShadedCube();
    sphereData = generateSphere(128,128);


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
    program = initShaders(gl,
      "vertex-shader",
      "fragment-shader"
    );
    //Initialize atribute buffers
    gl.useProgram(program);

    // var image = document.getElementById("texImage");
    // initTexture(image);

    loadImages(
      [
        "earth.jpg",
        "mar0kuu2.jpg",
        "pluto.jpg"
      ],
      initTextures
    );

    textureLoc = gl.getUniformLocation
      (
        program, "texture"
      );


    // Create the buffers for the object
    var cubeVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeVBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeData.points), gl.STATIC_DRAW );

    var cubeNBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeNBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cubeData.surfaceNormals), gl.STATIC_DRAW );

    var cubeTBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cubeData.texCoords), gl.STATIC_DRAW );

    var sphereVBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereVBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereData.points), gl.STATIC_DRAW );

    var sphereNBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, sphereNBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(sphereData.normals), gl.STATIC_DRAW );

    var sphereTBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereTBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sphereData.texCoords), gl.STATIC_DRAW );

    // var sphereIBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(sphereData.indexData), gl.STATIC_DRAW );
    // //------------------------------------------------------------------------

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
    cubeNode.translate([5.0,0.0,0.0]);
    cubeNode.scale([10.0,10.0,10.0]);
    cubeNode.addDrawable(
    {
      bufferInfo:
      {
        vBuffer: sphereVBuffer,
        nBuffer: sphereNBuffer,
        tBuffer: sphereTBuffer,
        //iBuffer: sphereIBuffer,
        numVertices: sphereData.numVertices
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
        shininess: shininessLoc,
        textureloc: textureLoc
      },

      uniformInfo:
      {
        lm_Vars: new function()
        {
          this.lightPosition =  vec4(0.0, 0.0, 0.0, 0.0 );
          this.lightAmbient =   vec4(0.2, 0.2, 0.2, 1.0 );
          this.lightDiffuse =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.lightSpecular =  vec4( 1.0, 1.0, 1.0, 1.0 );

          this.materialAmbient =    vec4( 0.5, 0.5, 0.5, 1.0 );
          this.materialDiffuse =    vec4( 0.7, 0.7, 0.7, 1.0);
          this.materialSpecular =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.materialShininess =  20;

          this.ambientProduct =   mult(this.lightAmbient, this.materialAmbient);
          this.diffuseProduct =   mult(this.lightDiffuse, this.materialDiffuse);
          this.specularProduct =  mult(this.lightSpecular, this.materialSpecular);
        }
      },
      textureUnit: 0
    });

    marsNode = new SceneNode(scene);
    marsNode.translate([13.0,0.0,0.0]);
    marsNode.scale([0.9,0.9,0.9]);
    marsNode.addDrawable(
    {
      bufferInfo:
      {
        vBuffer: sphereVBuffer,
        nBuffer: sphereNBuffer,
        tBuffer: sphereTBuffer,
        //iBuffer: sphereIBuffer,
        numVertices: sphereData.numVertices
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
        shininess: shininessLoc,
        textureloc: textureLoc
      },

      uniformInfo:
      {
        lm_Vars: new function()
        {
          this.lightPosition =  vec4(0.0, 0.0, 0.0, 0.0 );
          this.lightAmbient =   vec4(0.2, 0.2, 0.2, 1.0 );
          this.lightDiffuse =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.lightSpecular =  vec4( 1.0, 1.0, 1.0, 1.0 );

          this.materialAmbient =    vec4( 0.5, 0.5, 0.5, 1.0 );
          this.materialDiffuse =    vec4( 0.7, 0.7, 0.7, 1.0);
          this.materialSpecular =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.materialShininess =  20;

          this.ambientProduct =   mult(this.lightAmbient, this.materialAmbient);
          this.diffuseProduct =   mult(this.lightDiffuse, this.materialDiffuse);
          this.specularProduct =  mult(this.lightSpecular, this.materialSpecular);
        }
      },
      textureUnit: 1
    });

    moonNode = new SceneNode(marsNode);
    moonNode.translate([5.0,0.0,0.0]);
    moonNode.scale([0.3,0.3,0.3]);
    moonNode.addDrawable(
    {
      bufferInfo:
      {
        vBuffer: sphereVBuffer,
        nBuffer: sphereNBuffer,
        tBuffer: sphereTBuffer,
        //iBuffer: sphereIBuffer,
        numVertices: sphereData.numVertices
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
        shininess: shininessLoc,
        textureloc: textureLoc
      },

      uniformInfo:
      {
        lm_Vars: new function()
        {
          this.lightPosition =  vec4(0.0, 0.0, 0.0, 0.0 );
          this.lightAmbient =   vec4(0.2, 0.2, 0.2, 1.0 );
          this.lightDiffuse =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.lightSpecular =  vec4( 1.0, 1.0, 1.0, 1.0 );

          this.materialAmbient =    vec4( 0.5, 0.5, 0.5, 1.0 );
          this.materialDiffuse =    vec4( 0.7, 0.7, 0.7, 1.0);
          this.materialSpecular =   vec4( 1.0, 1.0, 1.0, 1.0 );
          this.materialShininess =  20;

          this.ambientProduct =   mult(this.lightAmbient, this.materialAmbient);
          this.diffuseProduct =   mult(this.lightDiffuse, this.materialDiffuse);
          this.specularProduct =  mult(this.lightSpecular, this.materialSpecular);
        }
      },
      textureUnit: 2
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

    cubeNode.rotateSelf(0.1, [0,1,0]);
    cubeNode.rotate(0.1, [0,1,0]);
    marsNode.rotate(1,[0,1,0]);
    marsNode.rotateSelf(1,[0,1,0]);

    moonNode.rotate(1,[0,1,0]);
    moonNode.rotateSelf(1,[0,1,0]);

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

  function loadImage(url, callback){
    var image = new Image();
    image.crossOrigin = "";
    image.src = url;
    image.onload = callback;
    return image;
  }

  function loadImages(urls, callback){
    var images = [];
    var imagesToLoad = urls.length;

    var onImageLoad = function() {
       --imagesToLoad;
       // If all the images are loaded call the callback.
      if (imagesToLoad == 0) {
         callback(images);
      }
    };

    for (var ii = 0; ii < imagesToLoad; ++ii) {
       var image = loadImage(urls[ii], onImageLoad);
       images.push(image);
    }
  }

  function initTextures(images){
    for (var ii = 0; ii < images.length; ++ii) {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[ii]);

      // add the texture to the array of textures.
      textures.push(texture);
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    //
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    //
    // gl.activeTexture(gl.TEXTURE3);
    // gl.bindTexture(gl.TEXTURE_2D, textures[3]);

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
      projectionMat = perspective(70, ratio, 0.1, 1000);
      gl.uniformMatrix4fv(projectionMatLoc,  false, flatten(projectionMat));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  // function initTexture(image){
  //   texture = gl.createTexture();
  //   gl.bindTexture( gl.TEXTURE_2D, texture );
  //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  //   gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
  //   gl.generateMipmap( gl.TEXTURE_2D );
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // }

  return {
    init: init
  }
})();
