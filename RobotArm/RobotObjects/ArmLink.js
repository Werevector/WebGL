

var ArmLink = (function()
{



  var points = [];
  var color = [];
  var indexColl = [];
  var colour = [ 1.0, 1.0, 0.0, 1.0 ];

  //Origin lies in one of the corners (most likely index 0 or 1)
  //Scalars for the span of the cube
  var XVector = 50;
  var YVector = 10;
  var ZVector = 20;
  //                                               BOTTOM |  TOP
  //              +------+   <<---- Link Shape    A,B,C,D | E,F,G,H
  //              |\     |\
  //              | +----+-+   +
  //              | |    | |   |
  //           +  +-+----+ |   | YVector
  //    ZVector \  \|     \|   |
  //             +  +------+   +
  //                +------+
  //                  XVector


  //Use indexing to create the base points for the shape, and then create
  //triangles to form the shape
  function GenerateLinkPoints(){


    //All points are derived from origin, and the scalars of the spanning vector
    vertexColl =
    [                                   //              Index
      vec3(0,       0,       0),        //point A Origin  | 1
      vec3(XVector, 0,       0),        //point B         | 2
      vec3(XVector, 0, ZVector),        //point C         | 3
      vec3(0,       0, ZVector),        //point D         | 4

      vec3(0,       YVector,       0),  //point E         | 5
      vec3(XVector, YVector,       0),  //point F         | 6
      vec3(XVector, YVector, ZVector),  //point G         | 7
      vec3(0,       YVector, ZVector),  //point H         | 8
    ]

    //Create index array, for triangulizing the shape.
    //Uses points from
    indexColl =
    [
      1, 2, 5,
      2, 6, 5,
      1, 4, 8,
      1, 5, 8,
      4, 3, 8,
      3, 7, 8,
      2, 3, 6,
      3, 6, 7,
      1, 4, 2,
      1, 2, 3,
      5, 6, 6,
      6, 7, 8
    ]

    // for (var i = 0; i < indexArray.length; ++i) {
    //
    //   points.push(vertices[indexArray[i] - 1]);
    //   if(i%3 === 0){ci++};
    //   colorArray.push(vertexColors[ci - 1]);
    //
    //   // for solid colored faces use
    //   //colorArray.push(vertexColors[a]);
    // }

  }

  function GetLinkPoints(){

  }
}) ();
