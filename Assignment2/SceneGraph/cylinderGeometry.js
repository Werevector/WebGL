/**
 * Created by endre on 24.08.15.
 */

/**
 * Generate a tradition cylinder centered at the origin.
 * The cylinder has height 1.0, diameter 1.0. It will be generated
 * with surface normals.
 *
 * Inspired from C++ version of Angel''s .Interactive Computer Graphics.
 *
 * @param numCylinderPlanes number of planes along the height part.
 */
function generateCylinder(numCylinderPlanes) {
    "use strict";

    var numCylinderVertices = (numCylinderPlanes*2*3)+(numCylinderPlanes*2*3);

    var points = [];
    var perVertexColors = [];


    var angleStep = (2*Math.PI)/numCylinderPlanes;

    for (var i=0; i<numCylinderPlanes; i++) {

        // top
        points.push([0.0, 0.5, 0.0, 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+1)), +0.5, 0.5*Math.sin(angleStep*(i+1)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+0)), +0.5, 0.5*Math.sin(angleStep*(i+0)), 1.0]);

        // Need two triangles to make a rectangle.

        // side1
        points.push([0.5*Math.cos(angleStep*(i+0)), -0.5,0.5*Math.sin(angleStep*(i+0)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+1)), +0.5,0.5*Math.sin(angleStep*(i+1)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+1)), -0.5,0.5*Math.sin(angleStep*(i+1)), 1.0]);

        // side2
        points.push([0.5*Math.cos(angleStep*(i+0)), -0.5, 0.5*Math.sin(angleStep*(i+0)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+0)), +0.5, 0.5*Math.sin(angleStep*(i+0)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+1)), +0.5, 0.5*Math.sin(angleStep*(i+1)), 1.0]);

        // bottom
        points.push([0.0, -0.5, 0.0, 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+0)), -0.5, 0.5*Math.sin(angleStep*(i+0)), 1.0]);
        points.push([0.5*Math.cos(angleStep*(i+1)), -0.5, 0.5*Math.sin(angleStep*(i+1)), 1.0]);
    }

    var surfaceNormals = generateSurfaceNormals(points);

    // Per vertex coloring
    for (var i = 0; i < numCylinderVertices; i++)
        perVertexColors.push([0.1, 0.4, 0.1, 1.0]);

    return {
        "numVertices": numCylinderVertices,
        "points": points,
        "normals": surfaceNormals,
        "colors": perVertexColors
    };
}