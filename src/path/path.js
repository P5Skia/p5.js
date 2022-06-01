/**
 * @module Path
 * @submodule Path
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
import {
  DIFFERENCE,
  INTERSECT,
  UNION,
  REVERSE_DIFFERENCE
} from '../core/constants';
import p5 from '../core/main';

p5.prototype.createPath = function(...args) {
  return new p5.Path(...args);
};

p5.prototype.createTextPath = function(text, font, fontSize, x, y) {
  //p5._validateParameters('createImage', arguments);
  let p = new p5.Path();

  if (typeof text === 'string' || text instanceof String) {
    let skFont = new CanvasKit.Font(font.skTypeface, fontSize);
    //p.skPath = CanvasKit.MakePathFromFont(text, skFont, x, y);
    p.skPath = CanvasKit.Path.MakeFromText(text, skFont, x, y);
  }

  return p;
};

p5.prototype.createTextPathOnPath = function(
  text,
  font,
  fontSize,
  path,
  initialOffset,
  offsetPercent
) {
  if (offsetPercent === undefined) {
    offsetPercent = false;
  }
  //p5._validateParameters('createImage', arguments);
  let p = new p5.Path();

  if (offsetPercent) {
    const len = path.getLength();
    initialOffset = (len * initialOffset) / 100;
  }

  if (typeof text === 'string' || text instanceof String) {
    let skFont = new CanvasKit.Font(font.skTypeface, fontSize);
    //p.skPath = CanvasKit.MakePathFromFont(text, skFont, x, y);
    p.skPath = CanvasKit.Path.MakeFromTextOnPath(
      text,
      skFont,
      path.skPath,
      initialOffset
    );
  }

  return p;
};

p5.prototype.createPathFromVerbsPointsWeights = function(
  verbs,
  points,
  weights
) {
  let p = new p5.Path();
  p.skPath = CanvasKit.Path.MakeFromVerbsPointsWeights(verbs, points, weights);
  return p;
};

p5.prototype.createPathFromPathOp = function(pathOne, pathTwo, op) {
  let p = new p5.Path();
  let _op;
  if (op === DIFFERENCE) {
    _op = CanvasKit.PathOp.Difference;
  } else if (op === INTERSECT) {
    _op = CanvasKit.PathOp.Intersect;
  } else if (op === UNION) {
    _op = CanvasKit.PathOp.Union;
  } else if (op === XOR) {
    _op = CanvasKit.PathOp.XOR;
  } else if (op === REVERSE_DIFFERENCE) {
    _op = CanvasKit.PathOp.ReverseDifference;
  }

  p.skPath = CanvasKit.Path.MakeFromOp(pathOne.skPath, pathTwo.skPath, _op);

  return p;
};

p5.prototype.drawPath = function(path, x = 0, y = 0) {
  this._renderer._drawPath(path, x, y);
};

export default p5;
