/* eslint-disable */

let path = new Array(9);
let counter = 0;

function preload() {}

function createStarPath(x, y) {
  const path = createPath();
  let R = 115.2;
  path.pathMoveTo(x + R + 0, y);
  for (let i = 1; i < 8; i++) {
    let a = 2.6927937 * i;
    path.lineTo(x + R * Math.cos(a), y + R * Math.sin(a));
  }
  path.closePath();
  return path;
}

function setup() {
  createCanvas(1024, 512);
  for (var y = 0; y < 2; y++) {
    for (var x = 0; x < 4; x++) {
      const i = y * 4 + x;
      path[i] = createStarPath(122 + x * 256, 128 + y * 256);
    }
  }
  path[4].simplify();
  path[9] = createStarPath(122 + 2 * 256, 128 + 0 * 256);
}

function draw() {
  background(224);
  strokeCap(SQUARE);
  strokeJoin(MITER);
  fill(255);

  stroke('#AAA');
  strokeWeight(5);

  drawPath(path[9]);
  stroke(0);

  for (var i = 0; i < 8; i++) {
    if (i == 0) {
      path[i].clearEffect();
      strokeWeight(5);
    } else if (i == 1) {
      path[i].setDashEffect([15, 5, 5, 5], counter / 5);
      strokeWeight(5);
    } else if (i == 2) {
      path[i].delete();
      path[i] = createStarPath(122 + 2 * 256, 128 + 0 * 256);
      path[i].clearEffect();
      path[i].trim(1 - (((counter * 0.75) / 100) % 1));
      strokeWeight(5);
      noFill();
    } else if (i == 3) {
      path[i].setDiscreteEffect(5, 2, counter / 5);
      strokeWeight(5);
      fill(255);
    } else if (i == 4) {
      path[i].clearEffect();
      strokeWeight(5);
    } else if (i == 5) {
      path[i].setCornerEffect(counter % 100);
      strokeWeight(5);
    } else if (i == 6) {
      //fill(0);
      path[i].delete();
      path[i] = createStarPath(122 + 2 * 256, 128 + 1 * 256);
      path[i].grow(8 + ((counter / 2) % 80));
      path[i].clearEffect();
      strokeWeight(5);
    } else {
      //fill(0);
      path[i].delete();
      path[i] = createStarPath(122 + 3 * 256, 128 + 1 * 256);
      path[i].shrink(2 + ((counter / 2) % 50));
      path[i].clearEffect();
      strokeWeight(5);
    }
    drawPath(path[i]);
  }
  counter++;
}
