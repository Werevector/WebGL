


function Camera()
{
  this.viewAngle  = [0,0,0];
  this.viewVector = vec3(0,0,1);
  this.position   = vec3(0,0,0);
  this.upVector   = vec3(0,1,0);
  this.lookPos    = vec3(0,0,0);
  this.right      = vec3(1,0,0);
  this.getCameraView = ReturnCameraViewMatrix;
  this.setViewVector = SetCameraViewVector;
  this.setUp = SetCameraUp;
  this.setRight = SetCameraRight;

  this.mouse = {
    initialized: false,

    // Previous mouse position
    lastX: -1,
    lastY: -1,

    // The difference from previous to current position
    deltaX: 0,
    deltaY: 0,

    mouseSensitivity: 100,

    // Have we used the deltaX and deltaY?
    consumedUpdate: false
  };

  this.updateAngle = CameraUpdateAngle;

  document.addEventListener('mousemove', CameraMouseMove.bind(this));
}

function ReturnCameraViewMatrix(tDelta)
{

  this.viewAngle[0] = 0;
  this.viewAngle[1] = 0;
  this.updateAngle(tDelta);

  var yawRotation = rotate(this.viewAngle[0], this.upVector);
  var pitchRotation = rotate(this.viewAngle[1], cross(this.viewVector, this.upVector));
  var rollRotation = rotate(this.viewAngle[2], this.viewVector);

  // var yawThenPitchRot = mult(pitchRotation, yawRotation);
  var YP_Rot = mult(pitchRotation, yawRotation);
  var R_Rot = rollRotation;

  this.setViewVector(vec3
  (
    dot(vec3(YP_Rot[0]), this.viewVector),
    dot(vec3(YP_Rot[1]), this.viewVector),
    dot(vec3(YP_Rot[2]), this.viewVector)
  ));

  this.setUp( vec3
  (
    dot(vec3(R_Rot[0]), this.upVector),
    dot(vec3(R_Rot[1]), this.upVector),
    dot(vec3(R_Rot[2]), this.upVector)
  ));

  this.right = cross(this.viewVector, this.upVector);

  this.viewAngle = [0,0,0];

  this.lookPos = add(this.position, this.viewVector);
  var resultMat = lookAt(this.position, this.lookPos, this.upVector);
  return resultMat;
}

function SetCameraViewVector(forwardDirection) {
    this.viewVector = normalize(vec3(forwardDirection));
};

function SetCameraUp(upDirection) {
    this.upVector = normalize(vec3(upDirection));
};

function SetCameraRight(rightDirection) {
    this.right = normalize(vec3(rightDirection));
};


// function SetCameraViewVector(forwardDirection) {
//     this.viewVector = normalize(vec3(forwardDirection));
// };

function CameraUpdateAngle(tDelta)
{
  if (!this.mouse.consumedUpdate) {
    this.viewAngle[0] -= this.mouse.mouseSensitivity * this.mouse.deltaX * tDelta;
    this.viewAngle[1] -= this.mouse.mouseSensitivity * this.mouse.deltaY * tDelta;
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
