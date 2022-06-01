/**
 * @module Path
 * @submodule Path
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.Path">p5.Path</a> class and P5 methods for
 * drawing Path to the main display canvas.
 */

import p5 from '../core/main';

p5.Path = function(...args) {
  if (args.length === 3) {
    this.skPath = CanvasKit.Path.MakeFromVerbsPointsWeights(
      args[0],
      args[1],
      args[2]
    );
  } else if (args.length === 2) {
    this.skPath = CanvasKit.Path.MakeFromVerbsPointsWeights(
      args[0],
      args[1],
      null
    );
  } else if (args.length === 1) {
    this.skPath = CanvasKit.Path.MakeFromSVGString(args[0]);
    //this.skPath.close();
  } else {
    this.skPath = new CanvasKit.Path();
  }
  this.subPaths = [];
  this.pathEffect = null;
};

p5.Path.prototype.duplicate = function() {
  const pth = new p5.Path();
  pth.skPath = this.skPath.copy();
  return pth;
};

p5.Path.prototype.computeTightBounds = function() {
  if (this.skPath) {
    return this.skPath.computeTightBounds();
  }
  return null;
};

p5.Path.prototype.delete = function() {
  if (this.skPath) {
    //console.log('path deleted');
    this.skPath.delete();
  }
};

p5.Path.prototype.addPath = function(secondPath) {
  if (secondPath.skPath) {
    this.skPath.addPath(secondPath.skPath);
  }
};

p5.Path.prototype.addSubPath = function(secondPath) {
  this.skPath.subPaths.push(secondPath);
};

p5.Path.prototype.contains = function(x, y) {
  if (this.skPath) {
    return this.skPath.contains(x, y);
  }
  return false;
};

p5.Path.prototype.getLength = function() {
  var meas = new CanvasKit.ContourMeasureIter(this.skPath, false, 1);
  var cont = meas.next();
  var dist = 0;
  while (cont) {
    dist += cont.length();
    cont = meas.next();
  }
  meas.delete();
  return dist;
};

p5.Path.prototype.setDashEffect = function(intervals, phase) {
  this.pathEffect = CanvasKit.PathEffect.MakeDash(intervals, phase);
};

p5.Path.prototype.setDiscreteEffect = function(segLength, dev, seed) {
  this.pathEffect = CanvasKit.PathEffect.MakeDiscrete(segLength, dev, seed);
};

p5.Path.prototype.setCornerEffect = function(radius) {
  this.pathEffect = CanvasKit.PathEffect.MakeCorner(radius);
};

p5.Path.prototype.clearEffect = function() {
  this.pathEffect = null;
};

p5.Path.prototype.reset = function() {
  if (this.skPath) {
    this.skPath.delete();
  }
  this.skPath = new CanvasKit.Path();
  this.pathEffect = null;
};

p5.Path.prototype.closePath = function() {
  this.skPath.close();
};

p5.Path.prototype.countPoints = function() {
  return this.skPath.countPoints();
};

p5.Path.prototype.countVerbs = function() {
  return this.skPath.countVerbs();
};

p5.Path.prototype.countWeights = function() {
  return this.skPath.countWeights();
};

p5.Path.prototype.getPoint = function(index) {
  return this.skPath.getPoint(index);
};

p5.Path.prototype.getVerb = function(index) {
  return this.skPath.getVerb(index);
};

p5.Path.prototype.getWeight = function(index) {
  return this.skPath.getWeight(index);
};

p5.Path.prototype.getPositionAt = function(dist) {
  return this.skPath.getPositionAt(dist);
};

p5.Path.prototype.getPoints = function() {
  const points = [];
  const numPoint = this.countPoints();
  for (var i = 0; i < numPoint; i++) {
    const pt = this.skPath.getPoint(i);
    points.push(pt[0]);
    points.push(pt[1]);
  }
  return points;
};

p5.Path.prototype.getVerbs = function() {
  const verbs = [];
  const numVerb = this.countVerbs();
  for (var i = 0; i < numVerb; i++) {
    const v = this.getVerb(i);
    verbs.push(v);
  }
  return verbs;
};

p5.Path.prototype.pathMoveTo = function(x, y) {
  this.skPath.moveTo(x, y);
};

p5.Path.prototype.lineTo = function(x, y) {
  this.skPath.lineTo(x, y);
};

p5.Path.prototype.cubicTo = function(x1, y1, x2, y2, x3, y3) {
  this.skPath.cubicTo(x1, y1, x2, y2, x3, y3);
};

p5.Path.prototype.quadTo = function(x1, y1, x2, y2) {
  this.skPath.quadTo(x1, y1, x2, y2);
};

p5.Path.prototype.conicTo = function(x1, y1, x2, y2, w) {
  this.skPath.conicTo(x1, y1, x2, y2, w);
};

p5.Path.prototype.arcToTangent = function(x1, y1, x2, y2, r) {
  this.skPath.arcToTangent(x1, y1, x2, y2, r);
};

p5.Path.prototype.addRRect = function(x, y, w, h, rx, ry) {
  if (ry === undefined) ry = rx;
  const rrect = CanvasKit.RRectXY([x, y, x + w, y + h], rx, ry);
  this.skPath.addRRect(rrect, true);
};

p5.Path.prototype.addOval = function(x, y, w, h, ccw) {
  this.skPath.addOval(CanvasKit.XYWHRect(x, y, w, h), ccw);
};

p5.Path.prototype.setEffect = function(effect) {
  this.pathEffect = effect;
};

p5.Path.prototype.simplify = function() {
  this.skPath.simplify();
};

p5.Path.prototype.trim = function(value, mode = true) {
  this.skPath.trim(value, 0.9999, mode);
};

p5.Path.prototype.grow = function(value, op = CanvasKit.PathOp.Union) {
  let orig = this.skPath.copy();
  this.skPath
    .stroke({
      width: value,
      join: CanvasKit.StrokeJoin.Round,
      cap: CanvasKit.StrokeCap.Square
    })
    .op(orig, op);
  orig.delete();
};

p5.Path.prototype.shrink = function(value) {
  let simplified = this.skPath.simplify().copy();
  this.skPath
    .stroke({
      width: value,
      join: CanvasKit.StrokeJoin.Bevel,
      cap: CanvasKit.StrokeCap.Butt
    })
    .op(simplified, CanvasKit.PathOp.ReverseDifference);
  simplified.delete();
};

p5.Path.prototype.translate = function(x, y) {
  const mt = CanvasKit.Matrix.translated(x, y);
  this.skPath.transform(mt);
};

p5.Path.prototype.scale = function(sx, sy, px, py) {
  const mt = CanvasKit.Matrix.scaled(sx, sy, px, py);
  this.skPath.transform(mt);
};

p5.Path.prototype.rotate = function(radians, px, py) {
  const mt = CanvasKit.Matrix.rotated(radians, px, py);
  this.skPath.transform(mt);
};

function getSubPathPoints(subPath) {
  const len = subPath.getLength();
  const num = len / 10 + 1;
  const l = len / num;
  const pt = [];
  for (var i = 1; i < num; i++) {
    const xysc = subPath.getPositionAt(i * l);
    pt.push([xysc[0], xysc[1]]);
  }
  return pt;
}

p5.Path.prototype.getPointArray = function() {
  const _paths = [];
  var _path = null;
  //var lastverb = -1;
  var lastpt = [];

  const pointCount = this.countPoints();
  const verbCount = this.countVerbs();
  //const weightCount = this.countWeights();

  let v = 0;
  let w = 0;
  for (let i = 0; i < pointCount; i++) {
    let pt = this.getPoint(i);
    let pt2;
    let pt3;
    let verb = this.getVerb(v);
    let weight;
    let subPath;
    let subPathPoints;
    let ii;
    v++;

    switch (verb) {
      case 0: // move
        _path = [];
        _path.push([pt[0], pt[1], 0]);
        _paths.push(_path);
        lastpt[0] = pt[0];
        lastpt[1] = pt[1];
        break;

      case 1: // line
        _path.push([pt[0], pt[1], 1]);
        lastpt[0] = pt[0];
        lastpt[1] = pt[1];
        break;

      case 4: // cubic
        // enum Verb { kMove_Verb, kLine_Verb, kQuad_Verb, kConic_Verb, kCubic_Verb, kClose_Verb, kDone_Verb, };
        //console.log('cubic');
        i++;
        pt2 = this.getPoint(i);
        i++;
        pt3 = this.getPoint(i);

        subPath = new p5.Path();
        subPath.pathMoveTo(lastpt[0], lastpt[1]);
        subPath.cubicTo(pt[0], pt[1], pt2[0], pt2[1], pt3[0], pt3[1]);
        subPathPoints = getSubPathPoints(subPath);
        for (ii = 0; ii < subPathPoints.length; ii++) {
          _path.push([subPathPoints[ii][0], subPathPoints[ii][1], 11]);
        }
        _path.push([pt3[0], pt3[1], 4]);
        lastpt[0] = pt3[0];
        lastpt[1] = pt3[1];
        break;

      case 2: // quad --
        //console.log('quad');
        //_path.push([pt[0], pt[1], 2]);
        i++;
        pt2 = this.getPoint(i);

        subPath = new p5.Path();
        subPath.pathMoveTo(lastpt[0], lastpt[1]);
        subPath.quadTo(pt[0], pt[1], pt2[0], pt2[1]);
        subPathPoints = getSubPathPoints(subPath);
        for (ii = 0; ii < subPathPoints.length; ii++) {
          _path.push([subPathPoints[ii][0], subPathPoints[ii][1], 11]);
        }
        _path.push([pt2[0], pt2[1], 2]);
        lastpt[0] = pt2[0];
        lastpt[1] = pt2[1];
        break;

      case 3: // conic
        //console.log('conic');
        weight = this.getWeight(w);
        w++;

        i++;
        pt2 = this.getPoint(i);

        subPath = new p5.Path();
        subPath.pathMoveTo(lastpt[0], lastpt[1]);
        subPath.conicTo(pt[0], pt[1], pt2[0], pt2[1], weight);
        subPathPoints = getSubPathPoints(subPath);
        for (ii = 0; ii < subPathPoints.length; ii++) {
          _path.push([subPathPoints[ii][0], subPathPoints[ii][1], 11]);
        }
        _path.push([pt2[0], pt2[1], 3]);
        lastpt[0] = pt2[0];
        lastpt[1] = pt2[1];
        break;

      case 5:
        if (lastpt[0] !== _path[0][0] || lastpt[1] !== _path[0][1]) {
          _path.push([lastpt[0], lastpt[1], 5]);
        }
        if (v < verbCount - 1) i--;
        break;
    }

    //lastverb = verb;
  }

  return _paths;
};

export default p5.Path;
