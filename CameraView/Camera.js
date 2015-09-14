


function Camera()
{
  this.viewAngle  = [0,0,-1];
  this.viewVector = vec3(0,0,-1);
  this.position   = vec3(0,0,0);
  this.upVector   = vec3(0,1,0);
  this.lookPos    = vec3(0,0,0);
  this.right      = vec3(0,0,0);
  this.getCameraView = ReturnCameraViewMatrix;

  this.mouse = {
    initialized: false,

    // Previous mouse position
    lastX: -1,
    lastY: -1,

    // The difference from previous to current position
    deltaX: 0,
    deltaY: 0,

    mouseSensitivity: 3,

    // Have we used the deltaX and deltaY?
    consumedUpdate: false
  };

  this.updateAngle = CameraUpdateAngle;

  document.addEventListener('mousemove', CameraMouseMove.bind(this));
}

function ReturnCameraViewMatrix(tDelta)
{
  this.updateAngle(tDelta);
  //var tempRot = rotationMatrix(this.viewAngle);

  // this.viewVector = vec3
  // (
  //   Math.cos(this.viewAngle[1]) * Math.sin(this.viewAngle[0]),
  //   Math.sin(this.viewAngle[1]),
  //   Math.cos(this.viewAngle[1]) * Math.cos(this.viewAngle[0])
  // );

  this.viewVector = vec3
  (
    Math.cos(this.viewAngle[1]) * Math.sin(this.viewAngle[0]),
    Math.sin(this.viewAngle[1]),
    Math.cos(this.viewAngle[1]) * Math.cos(this.viewAngle[0])
  );

  this.viewVector[0] =

  this.right = vec3
  (
    Math.sin(this.viewAngle[0] - 3.14/2.0),
    0,
    Math.cos(this.viewAngle[0] - 3.14/2.0)
  );

  this.upVector = cross(this.viewVector, this.right);

  this.lookPos = add(this.position, this.viewVector);
  var tempView = lookAt(this.position, this.lookPos, this.upVector);
  //return mult(tempView, tempRot);
  return tempView;
  //return lookAt(this.position, this.lookPos, this.upVector);
}

function CameraUpdateAngle(tDelta)
{
  if (!this.mouse.consumedUpdate) {
    this.viewAngle[0] += this.mouse.mouseSensitivity * this.mouse.deltaX * tDelta;
    this.viewAngle[1] += this.mouse.mouseSensitivity * this.mouse.deltaY * tDelta;
    this.mouse.consumedUpdate = true;
  }
}

function rotationMatrix(angles){
  var rx = rotate(angles[0], 1, 0, 0);
  var ry = rotate(angles[1], 0, 1, 0);
  var rz = rotate(angles[2], 0, 0, 1);
  return mult(rz, mult(ry, rx));
}

function CameraMouseMove(event)
{
  //console.log("moved");
  var newX = event.clientX;
  var newY = event.clientY;

  if (this.mouse.initialized) {
    this.mouse.deltaX = newX - this.mouse.lastX;
    this.mouse.deltaY = newY - this.mouse.lastY;
  } else {
    this.mouse.initialized = true;
  }

  this.mouse.lastX = newX;
  this.mouse.lastY = newY;

  // This is a new update
  this.mouse.consumedUpdate = false;
}
