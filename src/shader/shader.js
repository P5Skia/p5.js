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

p5.prototype.createSkiaShader = function(str, fonts, fontSize, width, maxLine) {
  const pShader = new p5.SkiaShader();

  return pShader;
};

p5.prototype.setSkiaShader = function(shader) {
  this._renderer._setShader(shader);
};

p5.prototype.noSkiaShader = function() {
  this._renderer._setShader(null);
};

export default p5;
