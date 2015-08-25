attribute vec4 vPosition;
varying vec4 vColor;
varying vec4 fColor;
uniform vec3 theta;

void main() {

     vec3 angles = radians( theta );
     vec3 c = cos( theta );
     vec3 s = sin( theta );

     mat4 rz = mat4( c.z, -s.z, 0.0, 0.0,
    		    s.z,  c.z, 0.0, 0.0,
    		    0.0,  0.0, 1.0, 0.0,
    		    0.0,  0.0, 0.0, 1.0 );



    //gl_Position = vPosition;
    gl_Position = rz * vPosition;
    vColor = vec4((1.0+vPosition.xyz) * (cos(theta*theta)) ,  1.0);
    fColor = vColor;


}
