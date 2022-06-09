/* eslint-disable */

let path;

function preload() {}

const PARAMS = {
  num_points: 8,
  animation: true,
};

let w = 1080;
let h = 1080;

let xmargin = 40;
let xlen = w - xmargin * 2;
let xrange = xlen / (PARAMS.num_points - 1);
let ymargin = 80;
let ytop = ymargin;
let ybottom = h - ymargin;

let cx = w / 2;
let cy = h / 2;

let points = [];
let drawPoints = [];

let pane;
let paneInputNumPoints;
let lerpValue = 0;

let num_range;
let range;

let ctrlPoints = [];
let bezierPoints = [];

function createPane() {
  pane = new Tweakpane.Pane();
  paneInputNumPoints = pane.addInput(PARAMS, 'num_points', {
    step: 1,
    min: 2,
    max: 10
  });
  pane.addInput(PARAMS, 'animation');
}

function createPoints() {
  points = [];

  xlen = w - xmargin * 2;
  xrange = xlen / (PARAMS.num_points - 1);
  ybottom = h - ymargin;
  for (var i = 0; i < PARAMS.num_points; i++) {
    var x = xmargin + i * xrange;
    var y;
    if (PARAMS.num_points < 4) {
      if (i & 1) {
        y = ytop;
      } else {
        y = ybottom;
      }
    } else {
      if (i & 1) {
        y = ybottom;
      } else {
        y = ytop;
      }
    }
    points.push(new Point(x, y));
  }
}

function createBezierPath(points) {
  const path = createPath();
  if( points.length < 4 ) {
    return path;
  }
  path.pathMoveTo( points[0].x, points[0].y );

  const n = points.length;
  let lastPoint = points[0];
  let lastCtrl = points[1];
  let idx = 1;
  let ctrl;
  let nextCtrl;
  let pt;

  ctrlPoints = [];
  bezierPoints = [];
  while( true ) {
    if( idx === n-3 ) {
      path.cubicTo( lastCtrl.x, lastCtrl.y, points[n-2].x, points[n-2].y, points[n-1].x, points[n-1].y );
      break;
    }
    let l1 = 1 * 2 / 3;
    let l2 = 1 / 3;
    if( idx === 1 ) {
      l1 = 0.5;
    }
    if( idx === n-4 ) {
      l2 = 0.5;
    }
    ctrl = new Point(lerp(points[idx].x, points[idx+1].x, l1), lerp(points[idx].y, points[idx+1].y, l1));
    ctrlPoints.push( ctrl );
    nextCtrl = new Point(lerp(points[idx+1].x, points[idx+2].x, l2), lerp(points[idx+1].y, points[idx+2].y, l2));
    ctrlPoints.push(nextCtrl );

    pt = new Point( lerp(ctrl.x, nextCtrl.x, 0.5), lerp(ctrl.y, nextCtrl.y, 0.5));
    bezierPoints.push(pt);

    path.cubicTo( lastCtrl.x, lastCtrl.y, ctrl.x, ctrl.y, pt.x, pt.y );
    lastPoint = pt;
    lastCtrl = nextCtrl;
    idx += 1;
  }
  return path;
}

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h);

  createPane();
  paneInputNumPoints.on('change', function(ev) {
    createPoints();
    drawPoints = [];
    lerpValue = 0;
  });
  createPoints();

}

function drawLerpPoints( lps, c ) {
  const r = red(c);
  const g = green(c);
  const b = blue(c);
  for( var i=0; i<lps.length; i++ ) {
    if( i & 1 ) {
      strokeWeight(1);
      stroke(color(r, g, b, 128));
      line(lps[i - 1].x, lps[i - 1].y, lps[i].x, lps[i].y);  
    }
    lps[i].draw(12, color(r, g, b));
  }
}

function draw() {
  background(255);

  strokeWeight(1);
  stroke(0, 192, 192, 128);
  path = createPath();
  path.pathMoveTo(points[0].x, points[0].y);
  for (var i = 1; i < PARAMS.num_points; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  drawPath(path);

  strokeWeight(6);
  stroke(0, 0, 255);
  noFill();
  const bezierPath = createBezierPath(points);
  drawPath(bezierPath);

  drawLerpPoints( ctrlPoints, '#F00' );
  for (var i = 0; i < ctrlPoints.length; i++) {
    //ctrlPoints[i].draw(8, '#F00');
  }
  for (var i = 0; i < bezierPoints.length; i++) {
    //bezierPoints[i].draw(8, '#0F0');
  }  

  for (var i = 0; i < PARAMS.num_points; i++) {
    points[i].draw();
  }

  if( PARAMS.animation ) {
    lerpValue += 0.1;
    if (lerpValue > 100) {
      lerpValue = 0;
      drawPoints = [];
    }
  }

}

function drawPoint(x, y, w = 16) {
  strokeWeight(w);
  if (this.dragging) {
    stroke(0, 255, 255);
  } else {
    stroke(0);
  }
  point(x, y);
}

class Point {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.dragging = false;
  }

  draw(w = 16, color = 0) {
    strokeWeight(w);
    if (this.dragging) {
      stroke(0, 255, 255);
    } else {
      stroke(color);
    }
    point(this.x, this.y);
  }

  isHit(_x, _y) {
    if (dist(_x, _y, this.x, this.y) <= 8) {
      return true;
    }
    return false;
  }
}

function mousePressed() {
  for (var i = 0; i < PARAMS.num_points; i++) {
    if (points[i].isHit(mouseX, mouseY)) {
      points[i].dragging = true;
      break;
    }
  }
  return false;
}

function mouseDragged() {
  for (var i = 0; i < PARAMS.num_points; i++) {
    if (points[i].dragging) {
      points[i].x = mouseX;
      points[i].y = mouseY;
    }
  }
}

function mouseReleased() {
  for (var i = 0; i < PARAMS.num_points; i++) {
    if (points[i].dragging) {
      points[i].dragging = false;
    }
  }
}
