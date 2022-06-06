/* eslint-disable */
let path = new Array(9);
let counter = 0;
let font,
  fontSize = 96;

function preload() {
  font = loadFont('assets/Kanit-Bold.ttf');
}

function setup() {
  createCanvas(1024, 192*4);
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 2; x++) {
      const i = y * 2 + x;
      path[i] = createTextPath(
        'ไก่ที่เป่าปี่',
        font,
        fontSize,
        10 + (x) * 512,
        128 + (y) * 192
      );
    }
  }
  path[4].simplify();
  path[9] = createTextPath(
    'ไก่ที่เป่าปี่',
    font,
    fontSize,
    10 + 0 * 512,
    128 + 1 * 192
  );
}

function draw() {
  background(224);
  strokeCap(SQUARE);
  strokeJoin(MITER);
  fill(255);

  stroke('#AAA');
  strokeWeight(4);

  drawPath(path[9]);
  stroke(0);

  for (var i = 0; i < 8; i++) {
    if (i == 0) {
      path[i].clearEffect();
      strokeWeight(4);
    } else if (i == 1) {
      path[i].setDashEffect([15, 5, 5, 5], counter / 5);
      strokeWeight(4);
    } else if (i == 2) {
      path[i].delete();
      path[i] = createTextPath(
        'ไก่ที่เป่าปี่',
        font,
        fontSize,
        10 + (0) * 512,
        128 + (1) * 192
      );
      path[i].clearEffect();
      path[i].trim((((counter * 0.75) / 100) % 1), true);
      strokeWeight(4);
      noFill();
    } else if (i == 3) {
      path[i].setDiscreteEffect(5, 2, counter / 5);
      strokeWeight(4);
      fill(255);
    } else if (i == 4) {
      path[i].clearEffect();
      strokeWeight(4);
    } else if (i == 5) {
      path[i].setCornerEffect((counter/10) % 10);
      strokeWeight(4);
    } else if (i == 6) {
      //fill(0);
      path[i].delete();
      path[i] = createTextPath(
        'ไก่ที่เป่าปี่',
        font,
        fontSize,
        10 + (0) * 512,
        128 + (3) * 192
      );      
      path[i].grow(8 + ((counter / 2) % 80), CanvasKit.PathOp.Difference);
      path[i].clearEffect();
      strokeWeight(4);
    } else {
      //fill(0);
      path[i].delete();
      path[i] = createTextPath(
        'ไก่ที่เป่าปี่',
        font,
        fontSize,
        10 + (1) * 512,
        128 + (3) * 192
      );      

      path[i].shrink(2 + ((counter / 6) % 10));
      path[i].clearEffect();
      strokeWeight(4);
    }
    drawPath(path[i]);
  }
  counter++;
}
