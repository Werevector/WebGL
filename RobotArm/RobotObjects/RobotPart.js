"use strict";


function RobotPart(partModel){

  this.partModel = partModel;
  this.connections = [];
  this.rotate = RotateRobotPart;
  this.translate = TranslateRobotPart;
  this.scale = ScaleRobotPart;
  this.connect = AddRobotPartConnection;
  this.draw = DrawRobotPart;
  this.angles = [0,0,0];
}

function RotateRobotPart(angle){
  this.partModel.rotate(angle);
  for(var i = 0; i < this.connections.length; i++){
    this.connections[i].rotate(angle);
  }
}

function TranslateRobotPart(x,y,z){
  this.partModel.translate(x,y,z);
  for(var i = 0; i < this.connections.length; i++){
    this.connections[i].translate(x,y,z);
  }
}

function ScaleRobotPart(x,y,z){
  this.partModel.scale(x,y,z);
  for(var i = 0; i < this.connections.length; i++){
  this.connections[i].scale(x,y,z);
  }
}

function AddRobotPartConnection(partModel){
  this.connections.push(partModel);
}

function DrawRobotPart(Vcolor, Vposition){
  this.partModel.draw(Vcolor, Vposition);
}
