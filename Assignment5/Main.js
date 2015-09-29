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
var viewMat;

var sphereBuffer;
var cubeBuffer;


var textures = [];

var programInfo;
var sphereBufferInfo;
var cubeBufferInfo;

//Uniform Locations
var projectionMatLoc;
var viewMatLoc;

var ColorLocation;
var WorldMatLocation;
var NormalMatLocation;
var TextureLocation;
var UsingLightLocation;
var LightLocation;

var AmbientLocation;
var DiffuseLocation;
var SpecularLocation;

var vPositionLocation;
var vNormalLocation;
var vTexCoordLocation;

var main = (function() {

  var browserCanvas;

  function init() {


    //Create the OpenGL context, to be used in the program
    gl = WebGLUtils.setupWebGL(browserCanvas);
    if (!gl) {
      alert("WebGl isn't available");
    }
    gl.enable(gl.DEPTH_TEST);


    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

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

    loadImages(
      [
        "earth.jpg",
        "mars.jpg",
        "pluto.jpg"
      ],
      initTextures
    );



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


    viewMat = camera.getCameraView(tDelta);
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));

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

  function initObjects(){
    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 600;
    browserCanvas.height = 600;

    //Set the viewport
    gl.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);

    camera = new Camera();
    camera.position[2] = -10;
    camera.position[0] = 5;

    cubeData = new ShadedCube();
    sphereData = generateSphere(128,128);

    projectionMat = perspective(70, browserCanvas.width / browserCanvas.height, 0.01, 1000);
    viewMat = camera.getCameraView(tDelta);

    programInfo = {
        program: program,
        attributeLocations: {
            vPosition: vPositionLocation,
            vNormal: vNormalLocation,
            vTexCoord: vTexCoordLocation
        },
        uniformLocations: {
          // Uniforms set once during lifetime?
          projectionMatrix: ProjectionMatLocation,
          light: LightLocation,

          // Set once per per program
          viewMatrix: ViewMatLocation,

          // Uniforms set every draw call
          worldMatrix: WorldMatLocation,
          normalMatrix: NormalMatLocation,
          texture: TextureLocation,
          color: ColorLocation,
          usingLight: UsingLightLocation,

          // Materials
          ambientLocation: AmbientLocation,
          diffuseLocation: DiffuseLocation,
          specularLocation: SpecularLocation
        }
    };

    //-------------------------------------------------------------------------
    gl.uniformMatrix4fv(projectionMatLoc,  false, flatten(projectionMat));
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));
    //-------------------------------------------------------------------------



  }

  function initUniforms(){
    viewMatLoc = gl.getUniformLocation(program, "viewMat");
    projectionMatLoc = gl.getUniformLocation(program, "projectionMat");

    textureLoc = gl.getUniformLocation
    (
      program, "texture"
    );

    ColorLocation = gl.getUniformLocation(program, "Color");
    WorldMatLocation = gl.getUniformLocation(program, "WorldMatrix");
    NormalMatLocation = gl.getUniformLocation(program, "NormalMatrix");
    TextureLocation = gl.getUniformLocation(program, "texture");
    UsingLightLocation = gl.getUniformLocation(program, "usingLight");
    LightLocation = gl.getUniformLocation(program, "light");

    AmbientLocation = gl.getUniformLocation(program, "ambient");
    DiffuseLocation = gl.getUniformLocation(program, "diffuse");
    SpecularLocation = gl.getUniformLocation(program, "specular");

    // Get all relevant attribute locations
    vPositionLocation = gl.getAttribLocation(program, "vPosition");
    vNormalLocation = gl.getAttribLocation(program, "vNormal");
    vTexCoordLocation = gl.getAttribLocation(program, "vTexCoord");
  }

  function initBuffers(){

    // Create the buffers for the object
    sphereBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten([].concat(sphereData.points, sphereData.normals, sphereData.texCoords))), gl.STATIC_DRAW);

    sphereBufferInfo = {
      buffer: sphereBuffer,
      numVertices: sphereData.numVertices
    };

    cubeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten([].concat(cubeData.points, cubeData.normals, cubeData.texCoords))), gl.STATIC_DRAW);

    cubeBufferInfo = {
      buffer: cubeBuffer,
      numVertices: cubeData.numVertices
    };

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

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
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

  return {
    init: init
  }
})();
