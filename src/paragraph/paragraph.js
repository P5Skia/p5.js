/**
 * @module Paragraph
 * @submodule Paragraph
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
import p5 from '../core/main';

p5.prototype.createParagraph = function(str, fonts, fontSize, width, maxLine) {
  const pParagraph = new p5.Paragraph();

  let skfonts = [];
  fonts.forEach(f => {
    const skf = f.arrayBuffer;
    //console.log(skf);
    skfonts.push(skf);
  });

  pParagraph.fontMgr = CanvasKit.FontMgr.FromData(skfonts);
  //console.log('Paragraph');

  let familyNames = [];
  let numFamily = pParagraph.fontMgr.countFamilies();
  //console.log(numFamily);
  for (var i = 0; i < numFamily; i++) {
    const fname = pParagraph.fontMgr.getFamilyName(i);
    //console.log('family', fname);
    familyNames.push(fname);
  }

  pParagraph.paraStyle = new CanvasKit.ParagraphStyle({
    textStyle: {
      color: CanvasKit.BLACK,
      fontFamilies: familyNames,
      fontSize: fontSize
    },
    textAlign: CanvasKit.TextAlign.Left,
    maxLines: maxLine,
    ellipsis: '...'
  });

  pParagraph.builder = CanvasKit.ParagraphBuilder.Make(
    pParagraph.paraStyle,
    pParagraph.fontMgr
  );
  pParagraph.builder.addText(str);
  pParagraph.paragraph = pParagraph.builder.build();

  pParagraph.paragraph.layout(width);

  return pParagraph;
};

p5.prototype.drawParagraph = function(paragraph, x = 0, y = 0) {
  this._renderer._drawParagraph(paragraph, x, y);
};

export default p5;
