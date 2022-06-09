let font = null;
let textPath = null;
let bounds;
let points = [];
let points2 = [];
let pointCount;
let verbCount;
let text = '';
let fontSize = 0;
let metrics = null;
let numPoints = 4;
let draggingPoint = null;
let controlPath = null;
let controlPath2 = null;
let textPoints = null;
let envPoints = null;
let envPoints2 = null;
let newTextPoints = null;
let newTextPath = null;
let newOutlinePath = null;
let isEdit = true;
let outlineSize = 10;

function downloadAssets() {
  font = loadFont('assets/Kanit-Regular.ttf');
}

function createControlPoints() {
  points = [];
  points2 = [];
  const pt = new Point((width - bounds.w) / 2, height / 2);
  points.push(pt);
  const pt2 = new Point((width - bounds.w) / 2, height / 2 + metrics.ascent);
  points2.push(pt2);

  for (var i = 1; i < numPoints; i++) {
    const ptt = new Point(
      (width - bounds.w) / 2 + (i / (numPoints - 1)) * bounds.w,
      height / 2
    );
    points.push(ptt);

    const ptt2 = new Point(
      (width - bounds.w) / 2 + (i / (numPoints - 1)) * bounds.w,
      height / 2 + metrics.ascent
    );
    points2.push(ptt2);
  }
}

function drawBounds() {
  if (bounds) {
    noFill();
    strokeWeight(1);
    stroke('#8FF');
    rect(
      (width - bounds.w) / 2,
      height / 2 + metrics.ascent,
      bounds.w,
      bounds.h
    );
  }
}

function drawControlPath(points) {
  if (!controlPath) {
    let path = null;
    if (points.length === 2) {
      path = createPath();
      path.pathMoveTo(points[0].x, points[0].y);
      path.lineTo(points[1].x, points[1].y);
    } else if (points.length === 3) {
      path = createPath();
      path.pathMoveTo(points[0].x, points[0].y);
      path.quadTo(points[1].x, points[1].y, points[2].x, points[2].y);
      /*
    } else if (points.length === 4) {
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
      */
    } else if (points.length >= 4) {
      //path = createBezierPath(points);
      path = MakeCubicSplineInterpolation(points, points.length);
    }
    controlPath = path;
  }

  if (controlPath && isEdit) {
    strokeWeight(2);
    stroke(color(0, 255, 255, 255));
    noFill();
    drawPath(controlPath);
  }
}

function drawControlPath2(points) {
  if (!controlPath2) {
    let path = null;
    if (points.length === 2) {
      path = createPath();
      path.pathMoveTo(points[0].x, points[0].y);
      path.lineTo(points[1].x, points[1].y);
    } else if (points.length === 3) {
      path = createPath();
      path.pathMoveTo(points[0].x, points[0].y);
      path.quadTo(points[1].x, points[1].y, points[2].x, points[2].y);
      /*
    } else if (points.length === 4) {
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
      */
    } else if (points.length >= 4) {
      //path = createBezierPath(points);
      path = MakeCubicSplineInterpolation(points, points.length);
    }
    controlPath2 = path;
  }

  if (controlPath2 && isEdit) {
    strokeWeight(2);
    stroke(color(0, 255, 255, 255));
    noFill();
    drawPath(controlPath2);
  }
}

function getTextPoints() {
  if (!textPoints) {
    textPoints = [];
    for (let i = 0; i < pointCount; i++) {
      let pt = textPath.getPoint(i);
      let ptt = new Point(pt[0], pt[1]);
      textPoints.push(ptt);
    }
  }
}

function drawTextPath() {
  if (!textPath) {
    bounds = font.textBounds(text, 0, 0, fontSize);
    metrics = font.getMetrics(fontSize);
    //console.log(metrics);
    //console.log(bounds);
    textPath = createTextPath(
      text,
      font,
      fontSize,
      (width - bounds.w) / 2,
      height / 2
    );
    pointCount = textPath.countPoints();
    verbCount = textPath.countVerbs();
    createControlPoints();
    getTextPoints();
  }
  if (textPath) {
    stroke(0);
    //drawPath(textPath);
  }
}

function getPathPos(pth, dist) {
  var meas = new CanvasKit.ContourMeasureIter(pth.skPath, false, 1);
  var cont = meas.next();
  var xycs = new Float32Array(4);
  while (dist > cont.length()) {
    dist -= cont.length();
    cont.delete();
    cont = meas.next();
  }
  cont.getPosTan(dist, xycs);
  //var cx = xycs[0];
  //var cy = xycs[1];
  //var cosT = xycs[2];
  //var sinT = xycs[3];
  const pt = new Point(xycs[0], xycs[1]);
  return pt;
}

function genNewTextPath() {
  nPath = new createPath();
  var lastpt = [0, 0];
  var lastverb = -1;
  var pt2 = [0, 0];
  var pt3 = [0, 0];
  let v = 0;
  for (let i = 0; i < pointCount; i++) {
    let pt = textPath.getPoint(i);
    let verb = textPath.getVerb(v);
    v++;

    switch (verb) {
      case 0:
        nPath.pathMoveTo(newTextPoints[i].x, newTextPoints[i].y);
        break;

      case 1:
        nPath.lineTo(newTextPoints[i].x, newTextPoints[i].y);
        break;

      case 2:
        nPath.quadTo(
          newTextPoints[i].x,
          newTextPoints[i].y,
          newTextPoints[i + 1].x,
          newTextPoints[i + 1].y
        );
        i++;
        break;

      case 5:
        nPath.closePath();
        if (v < verbCount - 1) i--;
        break;
    }

    if (verb !== 5) {
      lastpt[0] = pt[0];
      lastpt[1] = pt[1];
    }
    lastverb = verb;
  }
  return nPath;
}

function genEnvPoints() {
  if (!envPoints || !envPoints2) {
    newTextPoints = [];

    const txtLen = bounds.w;
    const curveLen1 = controlPath.getLength();
    const curveLen2 = controlPath2.getLength();
    const y1 = height / 2;
    const y2 = y1 + metrics.ascent;
    //console.log(txtLen, curveLen1, curveLen2, textPoints.length);
    envPoints = [];
    envPoints2 = [];
    for (var i = 0; i < textPoints.length; i++) {
      const tp = textPoints[i];
      const tpx1 = ((tp.x - (width - bounds.w) / 2) / bounds.w) * curveLen1;
      const tpx2 = ((tp.x - (width - bounds.w) / 2) / bounds.w) * curveLen2;
      const pt1 = getPathPos(controlPath, tpx1);
      envPoints.push(pt1);
      const pt2 = getPathPos(controlPath2, tpx2);
      envPoints2.push(pt2);

      const l = (tp.y - y1) / (y2 - y1);
      const ntp = new Point();
      ntp.x = lerp(pt1.x, pt2.x, l);
      ntp.y = lerp(pt1.y, pt2.y, l);
      newTextPoints.push(ntp);
    }
    newTextPath = genNewTextPath();
    newOutlinePath = genNewTextPath();
    newOutlinePath.grow(outlineSize);
  }
}

function editorDraw(PARAMS) {
  if (
    PARAMS.fontSize !== fontSize ||
    PARAMS.text !== text ||
    outlineSize !== PARAMS.outline
  ) {
    if( PARAMS.fontSize !== fontSize ) {
      console.log( 'clear' );
      controlPath = null;
      controlPath2 = null;
      envPoints = null;
      envPoints2 = null;
      points = null;
      points2 = null;
      textPath = null;
      textPoints = null;
      newTextPoints = null;
      newTextPath = null;
      newOutlinePath = null;
    }    
    textPath = null;
    textPoints = null;
    fontSize = PARAMS.fontSize;
    text = PARAMS.text;
    envPoints = null;
    envPoints2 = null;
    outlineSize = PARAMS.outline;

  }
  isEdit = PARAMS.edit;

  //drawBounds();
  drawTextPath();
  //drawPoints(textPoints, 4, '#080');

  drawControlPath(points);
  drawControlPath2(points2);


  genEnvPoints();
  //drawPoints(envPoints, 4, 0);
  //drawPoints(envPoints2, 4, 0);
  //drawPoints(newTextPoints, 4, 0);
  strokeWeight(1);
  stroke(0);
  if (PARAMS.outline) {
    fill(PARAMS.outColor);
    drawPath(newOutlinePath);
  }
  strokeWeight(1);
  fill( PARAMS.txtColor);
  drawPath(newTextPath);
  if (isEdit) {
    drawPoints(points);
    drawPoints(points2);
  }
}

function resetPath() {
  path = null;
}

function processRightClick() {
  return true;
}

function processLeftClick() {
  for (var i = 0; i < points.length; i++) {
    if (points[i].isHit(mouseX, mouseY)) {
      draggingPoint = points[i];
      points[i].dragging = true;
      return false;
    }
  }

  for (var i = 0; i < points2.length; i++) {
    if (points2[i].isHit(mouseX, mouseY)) {
      draggingPoint = points2[i];
      points2[i].dragging = true;
      return false;
    }
  }
  return true;
}

function processLeftDragged() {
  if (draggingPoint) {
    draggingPoint.x = mouseX;
    draggingPoint.y = mouseY;
    controlPath = null;
    controlPath2 = null;
    envPoints = null;
    envPoints2 = null;
    return false;
  }
  return true;
}

function processLeftRelease() {
  if (draggingPoint) {
    draggingPoint.dragging = false;
    draggingPoint = null;
    controlPath = null;
    controlPath2 = null;
    envPoints = null;
    envPoints2 = null;
  }
  return true;
}

function processLeftDoubleClick() {
  return true;
}

function MakeCubicSplineInterpolation(pts, num) {
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

  let n = num - 1; // number of segments

  class Scratch {
    constructor() {
      this.a = { x: 0, y: 0 };
      this.b = { x: 0, y: 0 };
      this.c = { x: 0, y: 0 };
      this.r = { x: 0, y: 0 };
      this.p = { x: 0, y: 0 };
    }
  }
  // Can I do this will less allocation?
  let s = [];
  for (var i = 0; i < n; i++) {
    s.push(new Scratch());
  }

  s[0].a = { x: 0, y: 0 };
  s[0].b = { x: 2, y: 2 };
  s[0].c = { x: 1, y: 1 };
  s[0].r = { x: pts[0].x + 2 * pts[1].x, y: pts[0].y + 2 * pts[1].y };

  for (var i = 1; i < n - 1; ++i) {
    s[i].a = { x: 1, y: 1 };
    s[i].b = { x: 4, y: 4 };
    s[i].c = { x: 1, y: 1 };
    s[i].r = {
      x: 4 * pts[i].x + 2 * pts[i + 1].x,
      y: 4 * pts[i].y + 2 * pts[i + 1].y
    };
  }
  s[n - 1].a = { x: 2, y: 2 };
  s[n - 1].b = { x: 7, y: 7 };
  s[n - 1].c = { x: 0, y: 0 };
  s[n - 1].r = {
    x: 8 * pts[n - 1].x + pts[num - 1].x,
    y: 8 * pts[n - 1].y + pts[num - 1].y
  };

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
    let q = {
      x: 2 * pts[i + 1].x - s[i + 1].p.x,
      y: 2 * pts[i + 1].y - s[i + 1].p.y
    };
    //console.log( 'cubicTo', s[i].p.x, s[i].p.y, q.x, q.y, pts[i + 1].x, pts[i + 1].y);
    path.cubicTo(s[i].p.x, s[i].p.y, q.x, q.y, pts[i + 1].x, pts[i + 1].y);
  }
  let q = {
    x: 0.5 * (pts[num - 1].x + s[n - 1].p.x),
    y: 0.5 * (pts[num - 1].y + s[n - 1].p.y)
  };
  //console.log( 'cubicTo',s[n - 1].p.x, s[n - 1].p.y, q.x, q.y, pts[n].x, pts[n].y);
  path.cubicTo(s[n - 1].p.x, s[n - 1].p.y, q.x, q.y, pts[n].x, pts[n].y);

  return path;
}
