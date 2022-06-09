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

function createLerpPoints(pts, lerp_value) {
  const lerpPoints = [];
  console.log( pts.length );
  const ii = Math.floor(lerp_value / range);

  for (var i = 0; i < pts.length - 1; i++) {
    let minR = (ii+i-1) * range;
    if( minR < 0 ) {
      minR = 0;
    }
    let maxR = (ii+i+1) * range;
    if( maxR > 100 ) {
      maxR = 100;
    }
    if( lerp_value >= minR && lerp_value <= maxR ) {      
      let l = (lerp_value - minR) / (maxR - minR);
      lpp = new Point();
      lpp.x = lerp( pts[i].x, pts[i+1].x, l );
      lpp.y = lerp( pts[i].y, pts[i+1].y, l );
      lerpPoints.push(lpp);
    }
  }
  return lerpPoints;
}

function createSimpleLerpPoints(pts, lerpValue) {
  const lerpPoints = [];
  for (var i = 0; i < pts.length - 1; i++) {
    let l = lerpValue/100;
    lpp = new Point();
    lpp.x = lerp( pts[i].x, pts[i+1].x, l );
    lpp.y = lerp( pts[i].y, pts[i+1].y, l );
    lerpPoints.push(lpp);
  }
  return lerpPoints;
}

function createMainLerpPoints( pts, lerp_value ) {
  const lerpPoints = [];
  for (var i = 0; i < pts.length - 1; i++) {
    let minR = (i-2) * range;
    if( minR < 0 ) {
      minR = 0;
    }
    let maxR = (i+1) * range;
    if( maxR > 100 ) {
      maxR = 100;
    }
    if( lerp_value >= minR && lerp_value <= maxR ) {      
      let l = (lerp_value - minR) / (maxR - minR);
      lpp = new Point();
      lpp.x = lerp( pts[i].x, pts[i+1].x, l );
      lpp.y = lerp( pts[i].y, pts[i+1].y, l );
      lerpPoints.push(lpp);
    }
  }
  return lerpPoints;
}

function drawLerpPoints( lps, c ) {
  const r = red(c);
  const g = green(c);
  const b = blue(c);
  for( var i=0; i<lps.length; i++ ) {
    if( i > 0 ) {
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

  for (var i = 0; i < PARAMS.num_points; i++) {
    points[i].draw();
  }
  
  var pts = points;

  if( pts.length == 2 ) {
    range = 100;
    const xx = lerp( pts[0].x, pts[1].x, (lerpValue % range)/range );
    const yy = lerp( pts[0].y, pts[1].y, (lerpValue % range)/range );
    const pp = new Point(xx, yy);
    pp.draw(20, "#00F");
    drawPoints.push(pp);
  } else if( pts.length == 3 ) {
    lerpPoints = createSimpleLerpPoints(pts, lerpValue);
    drawLerpPoints( lerpPoints, '#F00');
    pts = lerpPoints;
    lerpPoints = createSimpleLerpPoints(pts, lerpValue);
    drawLerpPoints( lerpPoints, '#00F');
    drawPoints.push(lerpPoints[0]);
  } else if( pts.length == 4 ) {
    lerpPoints = createSimpleLerpPoints(pts, lerpValue);
    drawLerpPoints( lerpPoints, '#F00');
    pts = lerpPoints;
    lerpPoints = createSimpleLerpPoints(pts, lerpValue);
    drawLerpPoints( lerpPoints, '#0F0');
    pts = lerpPoints;
    lerpPoints = createSimpleLerpPoints(pts, lerpValue);
    drawLerpPoints( lerpPoints, '#00F');
    drawPoints.push(lerpPoints[0]);
  } else {
    num_range = pts.length - 3;
    range = 100 / num_range;
    while( pts.length >= 2 ) {
      var lerpPoints;
      if( pts.length > 2 ) {
        if( pts === points && pts.length > 4 ) {
          lerpPoints = createMainLerpPoints( pts, lerpValue);
        }
        else {
          lerpPoints = createLerpPoints(pts, lerpValue);
        }
      }
      else {
        lerpPoints = pts;
      }
      if( pts.length == 3 ) {
        drawLerpPoints( lerpPoints, '#00F');
      }
      else {
        drawLerpPoints( lerpPoints, '#F00');
      }
      if( lerpPoints.length == 2 ) {
        const xx = lerp( lerpPoints[0].x, lerpPoints[1].x, (lerpValue % range)/range );
        const yy = lerp( lerpPoints[0].y, lerpPoints[1].y, (lerpValue % range)/range );
        const pp = new Point(xx, yy);
        pp.draw(20, "#00F");
        drawPoints.push(pp);
      }
      if( lerpPoints.length == 2 ) {
        break;
      }
      pts = lerpPoints;
    }
  }


  for (var i = 0; i < drawPoints.length; i++) {
    drawPoints[i].draw(8, "#00F");
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
