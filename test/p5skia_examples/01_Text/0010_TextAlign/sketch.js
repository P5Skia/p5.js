/* eslint-disable */

let message = 'Hello, เป็ดเป่าปี่ดีที่สุด';
let font,
  fontSize = 44;
let hAlign;
let vAlign;
let input, button;

function preload() {
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont('/assets/Kanit-Regular.ttf');
}

function setText() {
  message = input.value();
}

function setup() {
  console.log('Hello');
  createCanvas(800, 400);
  textFont(font);
  textSize(fontSize);

  sel = createSelect();
  sel.position(10, 10);
  sel.option('LEFT');
  sel.option('CENTER');
  sel.option('RIGHT');
  sel.changed(mySelectEvent);
  sel.selected('CENTER');
  hAlign = CENTER;

  sel2 = createSelect();
  sel2.position(100, 10);
  sel2.option('TOP');
  sel2.option('CENTER');
  sel2.option('BASELINE');
  sel2.option('BOTTOM');
  sel2.changed(mySelectEvent2);
  sel2.selected('BASELINE');
  vAlign = BASELINE;  

  input = createInput();
  input.position(200, 10);

  button = createButton('submit');
  button.position(input.x + input.width, 10);
  button.mousePressed(setText);  
}

function mySelectEvent() {
  const h = sel.value();
  if (h === 'LEFT') hAlign = LEFT;
  else if (h === 'CENTER') hAlign = CENTER;
  else if (h === 'RIGHT') hAlign = RIGHT;
  //console.log(hAlign);
}

function mySelectEvent2() {
  const v = sel2.value();
  if (v === 'TOP') vAlign = TOP;
  else if (v === 'CENTER') vAlign = CENTER;
  else if (v === 'BASELINE') vAlign = BASELINE;
  else if (v === 'BOTTOM') vAlign = BOTTOM;
  //console.log(vAlign);
}

function draw() {
  background(255);
  stroke(color('cyan'));
  line(0, height / 2, width, height / 2);
  line(width / 2, 0, width / 2, height);

  //console.log(hAlign, vAlign);
  textAlign(hAlign, vAlign);

  let bbox = font.textBounds(message, width / 2, height / 2, fontSize);
  noFill();
  stroke(255, 0, 0);
  rect(bbox.x, bbox.y, bbox.w, bbox.h);

  noStroke();
  fill(0);
  text(message, width / 2, height / 2);
}
