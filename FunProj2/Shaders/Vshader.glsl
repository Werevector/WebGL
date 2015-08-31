attribute vec4 vPosition;
attribute vec4 vColor;
varying vec4 fColor;
uniform vec3 theta;
uniform float scale;

void main() {

     vec3 angles = radians( theta );
     vec3 c = cos( theta );
     vec3 s = sin( theta );

     mat4 scalerMat = mat4
      (
      scale,   0.0,   0.0,   0.0,
        0.0, scale,   0.0,   0.0,
        0.0,   0.0, scale,   0.0,
        0.0,   0.0,   0.0,     1
      );

     mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
 		    0.0,  c.x,  s.x, 0.0,
 		    0.0, -s.x,  c.x, 0.0,
 		    0.0,  0.0,  0.0, 1.0 );

     mat4 ry = mat4( c.y, 0.0, -s.y, 0.0,
 		    0.0, 1.0,  0.0, 0.0,
 		    s.y, 0.0,  c.y, 0.0,
 		    0.0, 0.0,  0.0, 1.0 );


     mat4 rz = mat4( c.z, -s.z, 0.0, 0.0,
 		    s.z,  c.z, 0.0, 0.0,
 		    0.0,  0.0, 1.0, 0.0,
 		    0.0,  0.0, 0.0, 1.0 );


    gl_Position = rz * ry * rx * scalerMat * vPosition;
    fColor = vColor;


}