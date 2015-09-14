


function Camera()
{
  this.viewAngle  = [0,0,0];
  this.viewVector = vec3(0,0,1);
  this.position   = vec3(0,0,0);
  this.upVector   = vec3(0,1,0);
  this.lookPos    = vec3(0,0,0);
  this.right      = vec3(0,0,0);
  this.getCameraView = ReturnCameraViewMatrix;
  this.setViewVector = SetCameraViewVector;
  this.setUp = SetCameraUp;

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
  this.viewAngle = [0,0,this.viewAngle[2]];
  this.updateAngle(tDelta);
  // this.viewAngle[0] = this.viewAngle[0] * this.mouse.mouseSensitivity;
  // this.viewAngle[1] = this.viewAngle[1] * this.mouse.mouseSensitivity;
  // this.viewAngle[2] = this.viewAngle[2] * this.mouse.mouseSensitivity;
  // var yawAngle = 0;
  // var pitchAngle = 0;
  // var rollAngle = 0;


  var yawRotation = rotate(this.viewAngle[0], this.upVector);
  var pitchRotation = rotate(this.viewAngle[1], cross(this.viewVector, this.upVector));
  var rollRotation = rotate(this.viewAngle[2], this.viewVector );

  // var yawThenPitchRot = mult(pitchRotation, yawRotation);
  var YP_Rot = mult(pitchRotation, yawRotation);
  var R_Rot = rollRotation;

  // If we want to update the up direction (eg. roll) we should handle
  // that independently, triggered by eg. a key press. It may be sensible to
  // roll about the forwardDirection?

  // Finally update the forward direction and (posssibly) the up directions
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

  this.right = cross(this.upVector, this.viewVector);

  // this.viewVector = vec3
  // (
  //   Math.cos(this.viewAngle[1]) * Math.sin(this.viewAngle[0]),
  //   Math.sin(this.viewAngle[1]),
  //   Math.cos(this.viewAngle[1]) * Math.cos(this.viewAngle[0])
  // );
  //
  // this.right = vec3
  // (
  //   Math.sin(this.viewAngle[0] - 3.14/2.0),
  //   0,
  //   Math.cos(this.viewAngle[0] - 3.14/2.0)
  // );
  //
  // this.upVector = cross(this.viewVector, this.right);
  //

  this.viewAngle = [0,0,0];
  this.lookPos = add(this.position, this.viewVector);
  var tempView = lookAt(this.position, this.lookPos, this.upVector);
  //return mult(tempView, tempRot);
  return tempView;
  //return lookAt(this.position, this.lookPos, this.upVector);



}

function SetCameraViewVector(forwardDirection) {
    this.viewVector = normalize(vec3(forwardDirection));
};

function SetCameraUp(rightDirection) {
    this.upVector = normalize(vec3(rightDirection));
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
