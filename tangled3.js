//cellular automata: a computational way of thinking
//generate cells over time according to rules
//state of a cell can be 0 or 1
//modelling the behaviour we see in the world through CA principle
//complexity: ordered pattern that is unpredictable A.K.A. nature

//A computer generated textile design that takes an array of 0s and 1s
//to define the movement of the yarn within the warp, creating a complex weft.
//Using as inspiration the concept of Cellular Automata, simple rules create unpredictable
//and complex patterns. 'Tangled' is a non linear narrative translated into a
//a messy weaving. It's a piece about how hard it is to talk and how easy
// it is to silence. A tangled yarn weaves within the loom, highlighting the pauses
//and suppressing the words.

//what is an elementary CA but a list of 0s and 1s?

var rms;
var mic;
var amplitude = new p5.Amplitude();


var w;
var columns;
var rows;
var board;
var next;


function setup(){
  createCanvas (600,900);

  mic = new p5.AudioIn();
  analyzer = new p5.Amplitude();
  analyzer.setInput(mic);

  w = 10;
   // Calculate columns and rows
   columns = floor(width / w);
   rows = floor(height / w);
   // Wacky way to make a 2D array is JS
   board = new Array(columns);
   for (let i = 0; i < columns; i++) {
     board[i] = new Array(rows);
   }
   // Going to use multiple 2D arrays and swap them
   next = new Array(columns);
   for (i = 0; i < columns; i++) {
     next[i] = new Array(rows);
   }
   init();

}

// function keyPressed(){
//   getAudioContext();
//   mic.start();
//
// }


function draw(){

background(255);

rms = mic.getLevel();
frameRate(2);
console.log(rms);

print(rms);

generate();
  for ( let i = 0; i < columns;i++) {
    for ( let j = 0; j < rows;j++) {
      if ((board[i][j] == rms<0.1)) fill(255);
      else fill(0);
      stroke(255);
      rect(i * w, j * w, w-1, w-1);
    }
  }

  // if (getAudioContext().state !== 'running') {
  //    text('click to start audio', width/2, height/2);
  //  } else {
  //    text('audio is enabled', width/2, height/2);
  //  }

}

function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
  var synth = new p5.MonoSynth();
  synth.play('A4', 0.5, 0, 0.2);
}
// If I want to make it interactive by pressing the mouse
// function mousePressed() {
//   init();
//}

// Fill board randomly
function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) board[i][j] = 1;
      // Filling the rest randomly
      else board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
}

// The process of creating the new generation - defining my rules
function generate() {

  // Loop through every spot in our 2D array and check spots neighbors
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      // Add up all the states in a 3x3 surrounding grid
      let rms = 255;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          rms += board[x+i][y+j];
        }
      }

      // A little trick to subtract the current cell's state since
      // we added it in the above loop
      rms -= board[x][y];
      // Rules of Life

      if      ((board[x][y] == 1) && (rms <  0.02)) next[x][y] = 0;           // Loneliness
      else if ((board[x][y] == 1) && (rms ==  0.02)) next[x][y] = 0;           // test
      else if ((board[x][y] == 1) && (rms >  0.03)) next[x][y] = 0;           // Overpopulation
      else if ((board[x][y] == 0) && (rms == 0.03)) next[x][y] = 1;           // Reproduction
      else    next[x][y] = board[x][y]; // Stasis
    }
  }
  // Swap!
  // let temp = board;
  // board = next;
  // next = temp;
}
