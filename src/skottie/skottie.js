/**
 * @module Skottie
 * @submodule Skottie
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
import p5 from '../core/main';

p5.prototype.loadSkottie = function(
  id,
  path,
  assets,
  successCallback,
  failureCallback
) {
  const pSkottie = new p5.Skottie(id);
  const self = this;

  const req = new Request(path, {
    method: 'GET',
    mode: 'cors'
  });

  fetch(path, req)
    .then(response => response.text())
    .then(data => {
      // GIF section
      //console.log(data);
      pSkottie.animation = CanvasKit.MakeManagedAnimation(data, assets);
      pSkottie.animDuration = pSkottie.animation.duration() * 1000;
      pSkottie.animSize = pSkottie.animation.size();

      if (typeof successCallback === 'function') {
        successCallback(pImg);
      }
      self._decrementPreload();
    })
    .catch(e => {
      p5._friendlyFileLoadError(0, path);
      if (typeof failureCallback === 'function') {
        failureCallback(e);
      } else {
        console.error(e);
      }
    });
  return pSkottie;
};

p5.prototype.drawSkottie = function(skottie, x = 0, y = 0) {
  this._renderer._drawSkottie(skottie, x, y);
};

export default p5;
