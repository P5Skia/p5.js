/* eslint-disable */

let w, h;


function preload() {
  downloadAssets();
}

const PARAMS = {
  text: 'สุขสันต์วันขึ้นปีใหม่ ขอให้มีความสุขตลอดปี',
  animation: true,
  fontSize: 80
};

function createPane() {
  pane = new Tweakpane.Pane();
  pane.addInput(PARAMS, 'text');
  pane.addInput(PARAMS, 'fontSize', {
    min: 24,
    max: 240,
  });
  pane.addInput(PARAMS, 'animation');
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w - 275, h);
  createPane();
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w - 275, h);
}

function draw() {
  background(255);
  drawPoints(PARAMS);
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    return processRightClick();
  }
  else {
    return processLeftClick();
  }
}

function doubleClicked() {
  addPoint( mouseX, mouseY );
}

function mouseDragged() {
  if( mouseButton === LEFT ) {
    return processLeftDragged();
  }
}

function mouseReleased() {
  if( mouseButton === LEFT ) {
    return processLeftRelease();
  }
}

document.addEventListener('contextmenu', event => event.preventDefault());