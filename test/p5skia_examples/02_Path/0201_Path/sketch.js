/* eslint-disable */

let path;

function preload() {}

function setup() {
  createCanvas(720, 400);
  path = createPath();
  path.pathMoveTo(20, 5);
  path.lineTo(30, 20);
  path.lineTo(40, 10);
  path.lineTo(50, 20);
  path.lineTo(60, 0);
  path.lineTo(20, 5);

  path.pathMoveTo(20, 80);
  path.cubicTo(90, 10, 160, 150, 190, 10);

  path.pathMoveTo(36, 148);
  path.quadTo(66, 188, 120, 136);
  path.lineTo(36, 148);

  path.pathMoveTo(150, 180);
  path.arcToTangent(150, 100, 50, 200, 20);
  path.lineTo(160, 160);

  path.pathMoveTo(20, 120);
  path.lineTo(20, 120);

  path.addRRect(100, 10, 40, 52, 10, 4);
}

function draw() {
  background(255);
  drawPath(path);
}
