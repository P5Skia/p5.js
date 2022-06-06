/* eslint-disable */

const str = 'This téxt ไก่ที่เป่าปี่ follow the curve...';
let path;
let font,
  fontSize = 40;
let textBlob;
let textLen;
let pathLen;
let minPosn, maxPosn;
let count = 0;

function preload() {
  font = loadFont('assets/Kanit-Regular.ttf');
}

function setup() {
  createCanvas(1024, 600);
  textFont(font);
  textSize(fontSize);

  textLen = font.textBounds(str, 0, 0, fontSize).w;

  path = createPath();
  path.pathMoveTo(62, 400);
  path.cubicTo(362, 100, 662, 700, 962, 400);
  pathLen = path.getLength();

  maxPosn = pathLen - textLen;
  textBlob = createTextBlob();
}

function draw() {
  background(255);

  stroke('#0FF');
  noFill();
  drawPath(path);

  let posn = maxPosn * (Math.sin(count) / 2 + 0.5);
  textBlob.MakeTextOnPath(str, path, font, fontSize, posn);
  noStroke();
  fill(0);
  drawTextBlob(textBlob);

  count += 0.03;
}
