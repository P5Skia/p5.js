/* eslint-disable */

let path = new Array(4);
let pathText;
let pathOval;
let message = 'สวัสดีเป็ดที่เป่าปี่';
let font,
  fontSize = 88;
let counter = 0;
let op;

const spiralSkSL = `
uniform float rad_scale;
uniform float2 in_center;
uniform float4 in_colors0;
uniform float4 in_colors1;

half4 main(float2 p) {
    float2 pp = p - in_center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y / pp.x);
    float t = (angle + 3.1415926/2) / (3.1415926);
    t += radius * rad_scale;
    t = fract(t);
    return half4(mix(in_colors0, in_colors1, t));
}
`;
let floats = [0.5, 350-100, 200-100, 0.75, 1, 0.75, 1, 1, 0.75, 0.75, 1];

function preload() {
  console.log('preload');
  font = loadFont('assets/Kanit-Black.ttf');
}

function setup() {
  createCanvas(720, 420);
  textFont(font);
  textSize(fontSize);
  fill('#8FF');
  stroke(0);
  strokeWeight(3);

  sel = createSelect();
  sel.position(5, 5);
  sel.option('Difference');
  sel.option('Intersect');
  sel.option('Union');
  sel.option('XOR');
  sel.option('ReverseDifference');
  sel.changed(mySelectEvent);
  sel.selected('Difference');
  op = DIFFERENCE;

  pathOval = createPath();
  pathOval.addOval(360 - 150, 210 - 150, 300, 300, false);

  pathText = createTextPath(message, font, fontSize, 0, 100);
  for (var i = 1; i < 4; i++) {
    let p = createTextPath(message, font, fontSize, 0, 100 + 100 * i);
    pathText = createPathFromPathOp(pathText, p, UNION);
  }

}

function mySelectEvent() {
  const _op = sel.value();
  if (_op === 'Difference') op = DIFFERENCE;
  else if (_op === 'Intersect') op = INTERSECT;
  else if (_op === 'Union') op = UNION;
  else if (_op === 'XOR') op = XOR;
  else if (_op === 'ReverseDifference') op = REVERSE_DIFFERENCE;

  console.log(op);
}

function draw() {
  console.log( 'draw' );
  background(255);
  
  let x = Math.sin(counter) * 1;

  //drawPath(pathText, 5 + x, 0);
  //drawPath(pathOval, 0, 0);
  pathText.translate(x, 0);
  let p = createPathFromPathOp(pathText, pathOval, op);
  drawPath(p, 0, 0);

  counter += 0.02;
}



