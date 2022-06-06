/* eslint-disable */
const str =
  'เป็นมนุษย์สุดประเสริฐเลิศคุณค่า 🧒🏻 กว่าบรรดาฝูงสัตว์เดรัจฉาน 🐕 จงฝ่าฟันพัฒนาวิชาการ 📚 อย่าล้างผลาญฤๅเข่นฆ่าบีฑาใคร 🗡️ ไม่ถือโทษโกรธแช่งซัดฮึดฮัดด่า 😡 หัดอภัยเหมือนกีฬาอัชฌาสัย 😊 ปฏิบัติประพฤติกฎกำหนดใจ 💖 พูดจาให้จ๊ะๆจ๋า 👄 น่าฟังเอยฯ';

let fontKanit,
  fontEmoji,
  fontSize = 32;
let counter = 0;

function preload() {
  fontKanit = loadFont('assets/Kanit-Regular.ttf');
  fontEmoji = loadFont('assets/NotoColorEmoji.ttf');
}

function setup() {
  createCanvas(720, 400);

  paragraph = createParagraph(str, [fontKanit, fontEmoji], 32, 300, 7);
}

function draw() {
  background(255);

  let w = 480 + 200 * Math.sin(counter * 0.015);
  paragraph.layout(w);
  drawParagraph(paragraph);

  stroke('#0ff');
  line(w, 0, w, height);
  counter++;
}
