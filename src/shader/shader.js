/**
 * @module Shader
 * @submodule Shader
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
import p5 from '../core/main';

p5.prototype.createShader = function(str, fonts, fontSize, width, maxLine) {
  const pShader = new p5.SkiaShader();

  return pShader;
};

p5.prototype.setShader = function(shader) {
  this._renderer._setShader(shader);
};

p5.prototype.noShader = function() {
  this._renderer._setShader(null);
};

export default p5;
