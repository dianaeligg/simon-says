const options = ["red", "green", "blue", "yellow"];
const boops = {
  red: new Audio("assets/boopRed.mp3"),
  green: new Audio("assets/boopGreen.mp3"),
  blue: new Audio("assets/boopBlue.mp3"),
  yellow: new Audio("assets/boopYellow.mp3"),
};
const wrong = new Audio("assets/wrong.mp3");
const sequence = [];
const delay = 1 * 1000;
const numBoopsAtStart = 3;
let playerTurn = false;
let currentColorIndex = 0;

const reset = () => {
  setTimeout(() => {
    console.log("RESETTING");
    playerTurn = false;
    currentColorIndex = 0;
    sequence.splice(0, sequence.length);
    for (i = 0; i < numBoopsAtStart; i++) {
      var r = Math.floor(Math.random() * options.length);
      sequence.push({ index: r, color: options[r] });
    }
    console.log(sequence);
    showSequence(sequence, 0);
  }, delay);
};

const showSequence = (sequence, i) => {
  if (i === 0) console.log('SHOW_SEQUENCE', sequence);
  if (i < sequence.length) {
    showBoop(sequence[i].color);
    setTimeout(() => {
      showSequence(sequence, i + 1);
    }, delay);
  } else {
    console.log('=============================');
    playerTurn = true;
  }
};

function showBoop(color, short = false) {
  console.log("SHOW_BOOP", color);
  boops[color].play();
  document.querySelector(`.${color}`).classList.add(`${color}Highlight`);
  setTimeout(() => {
    document.querySelector(`.${color}`).classList.remove(`${color}Highlight`);
  }, short ? delay/2 : delay);
}

document.querySelectorAll(".button").forEach((element) => {
  element.addEventListener("click", (e) => {
    verifyClick(e.target.getAttribute('data-color'));
  });
});

const verifyClick = (color) => {
  // console.log("VERIFY_CLICK", color);
  if (playerTurn) {
    if (color === sequence[currentColorIndex].color) {
      // console.log("CORRECT", color);
      showBoop(color, true);
      if (++currentColorIndex >= sequence.length) {
        playerTurn = false;
        currentColorIndex = 0;
        var r = Math.floor(Math.random() * options.length);
        sequence.push({ index: r, color: options[r] });
        setTimeout(() => showSequence(sequence, 0), delay);
      }
    } else {
      console.log("WRONG", color, sequence[currentColorIndex].color);
      wrong.play();
      reset();
    }
  }
};

reset();
