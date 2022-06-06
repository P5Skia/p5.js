/* eslint-disable */

function setup() {
  createCanvas(400, 400);
  noStroke();
  noLoop();
}

function draw() {
  background(255);

  fill('#f00');
  blendMode(BLEND);
  rect(0, 100, 400, 200);
  blendMode(BLEND);

  fill(color(0, 0, 255));
  rect(50, 0, 150, 400);
  blendMode(BLEND);
  fill(color(0, 0, 255, 128));
  rect(200, 0, 150, 400);
}
