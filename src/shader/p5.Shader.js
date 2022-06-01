/**
 * @module Shader
 * @submodule Shader
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.Shader">p5.Shader</a> class and P5 methods for
 * drawing Shader to the main display canvas.
 */

import p5 from '../core/main';

p5.SkiaShader = function() {
};

p5.SkiaShader.prototype.MakeRadialGradient = function(
  center,
  radius,
  colors,
  pos
) {
  let transform = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  this.skShader = CanvasKit.Shader.MakeRadialGradient(
    center,
    radius,
    colors,
    pos,
    CanvasKit.TileMode.Mirror,
    transform
  );
};

p5.SkiaShader.prototype.MakeRuntimeEffect = function(sksl) {
  this.effect = CanvasKit.RuntimeEffect.Make(sksl);
};

p5.SkiaShader.prototype.MakeRuntimeShader = function(floats) {
  this.skShader = this.effect.makeShader(floats, true);
};

export default p5.SkiaShader;
