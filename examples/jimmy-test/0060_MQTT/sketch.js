/* eslint-disable */

let w, h;
let mqtt;

function preload() {
  downloadAssets();
}

const PARAMS = {
  gear: 0,
  throttle: 0
};

function createPane() {
  pane = new Tweakpane.Pane();
  pane
    .addButton({
      title: 'Start',
      label: 'start' // optional
    })
    .on('click', () => {
      console.log('click');
      mqttSend('*zstart');
      setTimeout(function() {
        mqttSend('*zstart0');
      }, 500);
    });
  pane
    .addButton({
      title: 'Authen',
      label: 'nfc' // optional
    })
    .on('click', () => {
      mqttSend('*znfc');
    });
  pane
    .addButton({
      title: 'Ready',
      label: 'bms' // optional
    })
    .on('click', () => {
      mqttSend('*zready');
    });
  pane
    .addButton({
      title: 'Run',
      label: 'mcu' // optional
    })
    .on('click', () => {
      mqttSend('*zrun');
      mqttSend('*gear0');
      PARAMS.gear = 0;
    });

  pane
    .addInput(PARAMS, 'gear', {
      step: 1,
      min: 0,
      max: 2
    })
    .on('change', function(ev) {
      console.log(`*zgear${ev.value}`);
      mqttSend(`*zgear${ev.value}`);
    });

  pane
    .addInput(PARAMS, 'throttle', {
      min: 0,
      max: 100
    })
    .on('change', function(ev) {
      console.log(`*zrpm${Math.floor(ev.value)}`);
      mqttSend(`*zrpm${Math.floor(ev.value)}`);
    });    
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w - 275, h);
  createPane();
  mqtt = MQTTConnect();
}

function windowResized() {
  w = windowWidth;
  h = windowHeight;
  resizeCanvas(w - 275, h);
}

function draw() {
  background(255);
}

function mousePressed() {
  if (mouseButton === RIGHT) {
    return processRightClick();
  } else {
    return processLeftClick();
  }
}

function doubleClicked() {
  if (mouseButton === LEFT) {
    return processLeftDoubleClick();
  }
}

function mouseDragged() {
  if (mouseButton === LEFT) {
    return processLeftDragged();
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    return processLeftRelease();
  }
}

document.addEventListener('contextmenu', event => event.preventDefault());
