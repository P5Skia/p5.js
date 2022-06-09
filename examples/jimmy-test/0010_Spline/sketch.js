/* eslint-disable */

let path;

function preload() {}

let w = 1080;
let h = 1080;

let num_points = 8;

let xmargin = 40;
let xlen = w - xmargin * 2;
let xrange = xlen / (num_points - 1);
let ymargin = 80;
let ytop = ymargin;
let ybottom = h - ymargin;

let cx = w / 2;
let cy = h / 2;

let points = [];

function setup() {
  createCanvas(1080, 1080);
  //noLoop();

  for (var i = 0; i < num_points; i++) {
    var x = xmargin + i * xrange;
    var y;
    if (num_points < 4) {
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

function MakeCubicSplineInterpolation( pts, num ) {
  // Code borrowed from https://www.particleincell.com/2012/bezier-splines/

  const path = createPath();
  if (num < 2) {
      return path;
  }
  if (num == 2) {
      path.pathMoveTo(pts[0].x, pts[0].y);
      path.lineTo(pts[1].x, pts[1].y);
      return path;
  }

  let n = num - 1;  // number of segments

  class Scratch {
    constructor() {
      this.a = {x: 0, y: 0};
      this.b = {x: 0, y: 0};
      this.c = {x: 0, y: 0};
      this.r = {x: 0, y: 0};
      this.p = {x: 0, y: 0};
    }
  };
  // Can I do this will less allocation?
  let s = []
  for( var i=0; i<n; i++ ) {
    s.push( new Scratch() );
  }

  s[0].a = {x: 0, y: 0};
  s[0].b = {x: 2, y: 2};
  s[0].c = {x: 1, y: 1};
  s[0].r = {x: pts[0].x + 2 * pts[1].x, y: pts[0].y + 2 * pts[1].y};
  
  for (var i = 1; i < n - 1; ++i) {
      s[i].a = {x: 1, y: 1};
      s[i].b = {x: 4, y: 4};
      s[i].c = {x: 1, y: 1};
      s[i].r = {x: 4 * pts[i].x + 2 * pts[i + 1].x, y: 4 * pts[i].y + 2 * pts[i + 1].y};
  }
  s[n - 1].a = {x: 2, y: 2};
  s[n - 1].b = {x: 7, y: 7};
  s[n - 1].c = {x: 0, y: 0};
  s[n - 1].r = {x: 8 * pts[n - 1].x + pts[num - 1].x, y: 8 * pts[n - 1].y + pts[num - 1].y};

  for (var i = 1; i < n; i++) {
      let mx = s[i].a.x / s[i - 1].b.x;
      let my = s[i].a.y / s[i - 1].b.y;
      s[i].b.x -= mx * s[i - 1].c.x;
      s[i].b.y -= my * s[i - 1].c.y;
      s[i].r.x -= mx * s[i - 1].r.x;
      s[i].r.y -= my * s[i - 1].r.y;
  }

  s[n - 1].p.x = s[n - 1].r.x / s[n - 1].b.x;
  s[n - 1].p.y = s[n - 1].r.y / s[n - 1].b.y;
  for (var i = num - 3; i >= 0; --i) {
      s[i].p.x = (s[i].r.x - s[i].c.x * s[i + 1].p.x) / s[i].b.x;
      s[i].p.y = (s[i].r.y - s[i].c.y * s[i + 1].p.y) / s[i].b.y;
  }

  //console.log( 'moveTo', pts[0].x, pts[0].y)
  path.pathMoveTo(pts[0].x, pts[0].y);

  for (var i = 0; i < n - 1; i++) {
      let q = {x: 2 * pts[i + 1].x - s[i + 1].p.x, y: 2 * pts[i + 1].y - s[i + 1].p.y};
      //console.log( 'cubicTo', s[i].p.x, s[i].p.y, q.x, q.y, pts[i + 1].x, pts[i + 1].y);
      path.cubicTo(s[i].p.x, s[i].p.y, q.x, q.y, pts[i + 1].x, pts[i + 1].y);
  }
  let q = {x: 0.5 * (pts[num - 1].x + s[n - 1].p.x), 
           y: 0.5 * (pts[num - 1].y + s[n - 1].p.y)};
  //console.log( 'cubicTo',s[n - 1].p.x, s[n - 1].p.y, q.x, q.y, pts[n].x, pts[n].y);
  path.cubicTo(s[n - 1].p.x, s[n - 1].p.y, q.x, q.y, pts[n].x, pts[n].y);

  return path;
}

function draw() {
  background(255);

  strokeWeight(1);
  stroke(192);
  path = createPath();
  path.pathMoveTo(points[0].x, points[0].y);
  for (var i = 1; i < num_points; i++) {
    path.lineTo(points[i].x, points[i].y);
  }
  drawPath(path);

  noFill();
  if (num_points == 3) {
    strokeWeight(4);
    stroke(128);
    path = createPath();
    path.pathMoveTo(points[0].x, points[0].y);
    path.quadTo(points[1].x, points[1].y, points[2].x, points[2].y);
    drawPath(path);

    for (var i = 1; i < 10; i++) {
      let x1 = points[0].x + ((points[1].x - points[0].x) * i) / 10;
      let y1 = points[0].y + ((points[1].y - points[0].y) * i) / 10;
      let x2 = points[1].x + ((points[2].x - points[1].x) * i) / 10;
      let y2 = points[1].y + ((points[2].y - points[1].y) * i) / 10;
      let x3 = x1 + ((x2 - x1) * i) / 10;
      let y3 = y1 + ((y2 - y1) * i) / 10;

      strokeWeight(1);
      stroke(192);
      line(x1, y1, x2, y2);

      drawPoint(x1, y1, 8);
      drawPoint(x2, y2, 8);
      drawPoint(x3, y3, 8);
    }
  } else if (num_points == 4) {
    strokeWeight(4);
    stroke(128);
    path = createPath();
    path.pathMoveTo(points[0].x, points[0].y);
    path.cubicTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y,
      points[3].x,
      points[3].y
    );
    drawPath(path);

    for (var i = 1; i < 10; i++) {
      let x1 = points[0].x + ((points[1].x - points[0].x) * i) / 10;
      let y1 = points[0].y + ((points[1].y - points[0].y) * i) / 10;
      let x2 = points[1].x + ((points[2].x - points[1].x) * i) / 10;
      let y2 = points[1].y + ((points[2].y - points[1].y) * i) / 10;
      let x3 = points[2].x + ((points[3].x - points[2].x) * i) / 10;
      let y3 = points[2].y + ((points[3].y - points[2].y) * i) / 10;

      strokeWeight(1);
      stroke(240);
      line(x1, y1, x2, y2);
      line(x2, y2, x3, y3);

      drawPoint(x1, y1, 2);
      drawPoint(x2, y2, 2);
      drawPoint(x3, y3, 2);

      let xx1 = x1 + ((x2 - x1) * i) / 10;
      let yy1 = y1 + ((y2 - y1) * i) / 10;
      let xx2 = x2 + ((x3 - x2) * i) / 10;
      let yy2 = y2 + ((y3 - y2) * i) / 10;

      strokeWeight(1);
      stroke(192);
      line(xx1, yy1, xx2, yy2);
      line(xx2, yy2, xx2, yy2);

      drawPoint(xx1, yy1, 4);
      drawPoint(xx2, yy2, 4);

      let xxx1 = xx1 + ((xx2 - xx1) * i) / 10;
      let yyy1 = yy1 + ((yy2 - yy1) * i) / 10;

      drawPoint(xxx1, yyy1, 8);
    }
  } else if (num_points > 4) {
    strokeWeight(4);
    stroke(0, 255, 255);
    beginShape();
    curveVertex(points[0].x, points[0].y);
    for (let i = 0; i < num_points; i++) {
      curveVertex(points[i].x, points[i].y);
    }
    curveVertex(points[num_points-1].x, points[num_points-1].y);
    endShape();

    stroke(128);
    let path = MakeCubicSplineInterpolation(points, points.length);
    drawPath(path)


    
  }

  for (var i = 0; i < num_points; i++) {
    points[i].draw();
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

  draw(w = 16) {
    strokeWeight(w);
    if (this.dragging) {
      stroke(0, 255, 255);
    } else {
      stroke(0);
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
  for (var i = 0; i < num_points; i++) {
    if (points[i].isHit(mouseX, mouseY)) {
      points[i].dragging = true;
      break;
    }
  }
  return false;
}

function mouseDragged() {
  for (var i = 0; i < num_points; i++) {
    if (points[i].dragging) {
      points[i].x = mouseX;
      points[i].y = mouseY;
    }
  }
}

function mouseReleased() {
  for (var i = 0; i < num_points; i++) {
    if (points[i].dragging) {
      points[i].dragging = false;
    }
  }
}
