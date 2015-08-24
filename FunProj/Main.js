"use strict"


var glContext;
//var colorArray = [0.0,0.0,0.0,1.0];
var theta;
var thetaLoc;


var main = (function() {

    var browserCanvas;

    function init() {

        theta = [0, 0, 0];

        //Loading canvas from the HTML Element
        browserCanvas = document.getElementById("gl-canvas");

        glContext = WebGLUtils.setupWebGL(browserCanvas);
        if (!glContext) {
            alert("WebGl isn't available");
        }


        var vertexPoints = [

            vec2(-1, -1),
            vec2(0, 1),
            vec2(1, -1)

        ];

        glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
        glContext.clearColor(0.0, 0.0, 0.0, 1.0);

        //Load Shaders
        var program = initShaders(glContext, "Shaders/Vshader.glsl", "Shaders/Fshader.glsl");

        //Initialize atrribute buffers
        glContext.useProgram(program);


        //Load data into GPU
        var bufferID = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferID);
        glContext.bufferData(glContext.ARRAY_BUFFER, flatten(vertexPoints), glContext.STATIC_DRAW);

        var vPosition = glContext.getAttribLocation(program, "vPosition");
        glContext.vertexAttribPointer(vPosition, 2, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(vPosition);

        thetaLoc = glContext.getUniformLocation(program, "theta");

        render();

    }


    function render() {
        glContext.clear(glContext.COLOR_BUFFER_BIT);
        glContext.drawArrays(glContext.TRIANGLES, 0, 3);

        theta[2] += 0.1;
        glContext.uniform3fv(thetaLoc, theta);

        requestAnimFrame(render);

    }

    return {
        init : init
    }

}) ();