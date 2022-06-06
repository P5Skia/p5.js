/* eslint-disable */

let img; // Declare variable 'img'.
let message = 'สวัสดีเป็ดที่เป่าปี่';
let font,
  fontSize = 88;
let x = 20;
let shader;
let counter = 0;

function preload() {
  font = loadFont('assets/Kanit-Black.ttf');
}

function setup() {
  createCanvas(720, 420);
  textFont(font);
  textSize(fontSize);
  shader = createSkiaShader();

  let colors = [CanvasKit.BLUE, CanvasKit.YELLOW, CanvasKit.RED];
  let pos = [0, 0.7, 1.0];
  shader.MakeRadialGradient(
    [width / 2, height / 2],
    height / 2 - 20,
    colors,
    pos
  );
}

function draw() {
  x = (Math.sin(counter)+1) * 50;
  setSkiaShader(null);
  background(255);
  fill(0);
  setSkiaShader(shader);
  noStroke();
  text(message, 5 + x, 100);
  text(message, 5 + x, 200);
  text(message, 5 + x, 300);
  text(message, 5 + x, 400);
  stroke(0);
  strokeWeight(3);
  noSkiaShader();
  noFill();
  text(message, 5 + x, 100);
  text(message, 5 + x, 200);
  text(message, 5 + x, 300);
  text(message, 5 + x, 400);
  counter += 0.05;
}
