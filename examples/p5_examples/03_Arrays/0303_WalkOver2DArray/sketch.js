

//"use strict"; //catch some common coding errors


/**
 * setup :
 */
 function setup() {
  createCanvas(400, 600);
  //create 2D array, slide 4
  let friendArray = [
    ["Nona", "mac & cheese", "orange", "Eid al-fitr"],
    ["Marylin", "ice cream", "blue", "Halloween"],
    ["Rashaad", "garbage plates", "turquoise", "Christmas"],
    ["Ava", "sushi", "pink", "New Years"]
  ];
  friendArray.push(["Xavier", "Louisiana creole", "red", "their birthday"]);

  //walking 2D array, slide 6
  let y = 20; // Start row based on text size of 20
  for (let f = 0; f < friendArray.length; f++) { // outer array
    let x = 10; // Start item in this row
    for (let t = 0; t < friendArray[f].length; t++) { //inner
      text(friendArray[f][t], x, y);
      x += textWidth(friendArray[f][t]) + 20; //place next item
    }
    y += 28; // place next row
  }

  //walking 2D array, variation on slide 6
  //with embedded arithmetic for y
  //
  for (let f = 0; f < friendArray.length; f++) { // outer array
    let x = 10; // Start item in this row
    for (let t = 0; t < friendArray[f].length; t++) { //inner
      //y is v-padding + LCV * v-spacing
      text(friendArray[f][t], x, 200 + f * 28);
      x += textWidth(friendArray[f][t]) + 20; //place next item
    }
  }

  //walking 2D array, slide 7
  //need to use x and y variables to manage canvas placement
  y = 400;
  for (let friend of friendArray) {
    let x = 10; // Start item in this row
    console.log("x and y", x, y);
    console.log("friend:", friend);
    for (let item of friend) {
      console.log("item & x:", item, x);
      text(item, x, y);
      x += textWidth(item) + 20; //place next item
    }
    y += 28; // place next row 
  }

  //slide 9, creating 2D array: schools of fish ages
  console.log("\n *** Fish ages in 2D ***");
  const schools = [];
  //4 schools of fish
  for (let t = 0; t < 4; t++) {
    schools[t] = []; //initialize this school 
    console.log("schools[t]?", t, schools[t]);

    // Add 10 randomized ages to the array
    for (let a = 0; a < 10; a++) {
      schools[t].push(round(random(1, 5)));
    }
  }
  console.log(schools);
}
