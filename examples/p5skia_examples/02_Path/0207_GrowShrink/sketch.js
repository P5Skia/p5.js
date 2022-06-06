/* eslint-disable */
let path;
let counter = 0;
let font,
  fontSize = 240;

function preload() {
  font = loadFont('assets/Kanit-Bold.ttf');
}

function setup() {
  createCanvas(1024, 768);
  const str = 'ไก่ที่เป่าปี่';
  bounds = font.textBounds(str, 0, 0, fontSize);
  console.log(width, bounds.w);
  console.log(height, bounds.h);
  path = createTextPath(
    str,
    font,
    fontSize,
    (width - bounds.w) / 2,
    height / 2
  );

  path2 = createTextPath(
    str,
    font,
    fontSize,
    (width - bounds.w) / 2,
    height / 2
  );  

  noLoop();
}

function draw() {
  background(224);
  strokeCap(SQUARE);
  strokeJoin(MITER);
  fill(255);

  stroke(0);
  strokeWeight(1);

  drawPath(path);

  noFill();
  stroke(255, 0, 0);
  for (var i = 1; i < 11; i++) {
    path.grow(10);
    drawPath(path);
  }

  stroke(0, 0, 255);
  for (var i = 1; i < 6; i++) {
    path2.shrink(10);
    drawPath(path2);
  }
}
