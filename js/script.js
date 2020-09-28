const options = ["red", "green", "blue", "yellow"];
const boops = {
  red: new Audio("assets/boopRed.mp3"),
  green: new Audio("assets/boopGreen.mp3"),
  blue: new Audio("assets/boopBlue.mp3"),
  yellow: new Audio("assets/boopYellow.mp3"),
};
const wrong = new Audio("assets/wrong.mp3");
const sequence = [];
const delay = 0.8 * 1000;
const numBoopsAtStart = 3;
const floatingIconSize = 75;
let playerTurn = false;
let currentColorIndex = 0;
let currentScore = 0;
let highScore = 0;
let soundOn = true;
let playing = false;

document.getElementsByClassName("soundOff")[0].classList.add("hidden");
document.getElementsByClassName("right")[0].classList.add("hidden");
document.getElementsByClassName("wrong")[0].classList.add("hidden");

const reset = () => {
  setTimeout(() => {
    playerTurn = false;
    playing = false;
    currentColorIndex = 0;
    currentScore = 0;
    updateScores();
    sequence.splice(0, sequence.length);
    for (i = 0; i < numBoopsAtStart; i++) {
      var r = Math.floor(Math.random() * options.length);
      sequence.push({ index: r, color: options[r] });
    }
    showSequence(sequence, 0);
  }, delay);
};

const showSequence = (sequence, i) => {
  if (i === 0) console.log("SHOW_SEQUENCE", sequence);
  if (i < sequence.length) {
    showBoop(sequence[i].color);
    setTimeout(() => {
      showSequence(sequence, i + 1);
    }, delay * 1.1);
  } else {
    playerTurn = true;
  }
};

function showBoop(color, short = false) {
  playSound(boops[color]);
  document.querySelector(`.${color}`).classList.add(`${color}Highlight`);
  setTimeout(
    () => {
      document.querySelector(`.${color}`).classList.remove(`${color}Highlight`);
    },
    short ? delay / 2 : delay
  );
}

const verifyClick = ({ x, y, target }) => {
  const color = target.getAttribute("data-color");
  if (playerTurn) {
    if (color === sequence[currentColorIndex].color) {
      animateClick(x, y, true);
      showBoop(color, true);
      if (currentScore < numBoopsAtStart) {
        currentScore++;
        updateScores();
      }
      if (++currentColorIndex >= sequence.length) {
        currentScore = sequence.length;
        updateScores();
        playerTurn = false;
        currentColorIndex = 0;
        var r = Math.floor(Math.random() * options.length);
        sequence.push({ index: r, color: options[r] });
        setTimeout(() => showSequence(sequence, 0), delay);
      }
    } else {
      animateClick(x, y, false);
      playSound(wrong);
      reset();
    }
  }
};

const animateClick = (x, y, right = true) => {
  const icon = right ? "checked" : "cancel";
  let floatingIcon = document.createElement("img");
  floatingIcon.classList.add("animated");
  floatingIcon.style.position = "fixed";
  floatingIcon.src = `./assets/${icon}.png`;
  floatingIcon.style.height = `${floatingIconSize}px`;
  floatingIcon.style.width = `${floatingIconSize}px`;
  floatingIcon.style.left = `${x - floatingIconSize / 2}px`;
  floatingIcon.style.top = `${y - floatingIconSize / 2}px`;
  floatingIcon.textContent = "THIS IS A TEST";
  document.getElementsByClassName("container")[0].appendChild(floatingIcon);
  // setTimeout as hacky way to have it happen after appendChild
  setTimeout(() => {
    floatingIcon.style.top = `${y - floatingIconSize * 2}px`;
    floatingIcon.style.opacity = "0";
  }, 0);
  setTimeout(() => {
    floatingIcon.remove();
  }, 2000);
};

const playSound = (sound) => {
  if (soundOn) {
    sound.play();
  }
};

const updateScores = () => {
  if (currentScore > highScore) {
    highScore = currentScore;
  }
  document.getElementsByClassName(
    "currentScoreValue"
  )[0].textContent = currentScore;
  document.getElementsByClassName("highScoreValue")[0].textContent = highScore;
};

document.querySelectorAll(".button").forEach((element) => {
  element.addEventListener("click", (e) => {
    verifyClick(e);
  });
});

const toggleSound = () => {
  soundOn = !soundOn;
  if (soundOn) {
    document.getElementsByClassName("soundOn")[0].classList.add("visible");
    document.getElementsByClassName("soundOff")[0].classList.add("hidden");
    document.getElementsByClassName("soundOn")[0].classList.remove("hidden");
    document.getElementsByClassName("soundOff")[0].classList.remove("visible");
  } else {
    document.getElementsByClassName("soundOn")[0].classList.add("hidden");
    document.getElementsByClassName("soundOff")[0].classList.add("visible");
    document.getElementsByClassName("soundOn")[0].classList.remove("visible");
    document.getElementsByClassName("soundOff")[0].classList.remove("hidden");
  }
};

document.querySelectorAll(".sounds").forEach((element) => {
  element.addEventListener("click", (e) => {
    toggleSound();
  });
});

document.querySelectorAll(".statuses").forEach((element) => {
  element.addEventListener("click", (e) => {
    if (!playing) {
      reset();
      playing = true;
    }
  });
});
