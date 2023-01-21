// select all the icons inside the icons container which in this case is just a storage for all
// the icons we have so we can withdraw any number of icons we want
let all = document.querySelectorAll(".icons-container i");

let duration = 1000;

let cardsContainer = document.querySelector(".cards-container");

let numberOfCards = 0;
// state of the finishing the game
let finishState = false;

let leaderBoard = document.querySelector(".leader-board");

// select player name
let player = document.querySelector(".game-container .header .name span");

let mistakes = document.querySelector(".game-container .header .mistakes span");

// select levels area in start screen
let levelsArea = document.querySelector(".hardness");

// displays the leader board into the start screen
displayOnLoad();

levelsArea.onclick = function (e) {
  // select the name input
  let name = document.getElementById("name");

  // if the clicked area is a level
  if (e.target.hasAttribute("data-number")) {
    // check if the name entered is valid and add the name to player name
    if (name.value && name.value.trim()) {
      player.textContent = name.value;
    } else {
      player.textContent = "Unknown";
    }

    name.value = "";

    // remove the start screen
    this.parentElement.style.display = "none";

    // the number of cards according to the chosen level
    numberOfCards = parseInt(e.target.dataset.number);

    // start the game
    startGame(numberOfCards);
  }
};

// function to start eveything and it takes the number of cards as an argument
function startGame(numberOfCards) {
  // array to store the icons (images) from all the images
  let images = [];

  for (let i = 0; i < numberOfCards; i++) {
    images.push(all[i]);
  }

  let test = shuffle(images);

  displayCards(images);

  Timer();
}

// this function recives an array and it shuffles this array using Fish-Yates method
// this is possible because the arrays in js are objects so the parameter is a reference to the
// actuall array
function shuffle(array) {
  let n = array.length,
    i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    [array[n], array[i]] = [array[i], array[n]];
  }
}

// display the cards in the game
function displayCards(images) {
  // select the cards container

  // for each imgae in the images array
  images.forEach((image) => {
    // create a card
    let card = document.createElement("div");
    card.className = "card";

    // create a front face for the card
    let front = document.createElement("div");
    front.className = "front face";
    card.appendChild(front);

    //create a back face for the card
    let back = document.createElement("div");
    back.className = "back face";
    back.appendChild(image);
    card.appendChild(back);

    // add the click event to each card
    card.addEventListener("click", cardClick);

    // append the card to the cards container
    cardsContainer.appendChild(card);
  });
}

// function executed on each card click
function cardClick() {
  // add flipped class to this card
  this.classList.add("flipped");

  // select all the cards
  let cards = document.querySelectorAll(".card");
  checkMatch(cards);

  if (countMatched(cards) === numberOfCards) {
    finishState = true;
  }
}

// counts the number of flipped cards
function countFlipped(cards) {
  let count = 0;
  cards.forEach((card) => {
    if (card.classList.contains("flipped")) {
      count++;
    }
  });
  return count;
}

function checkMatch(cards) {
  // if the number of the clicked cards is 2
  if (countFlipped(cards) === 2) {
    // select the images (icons) of the clicked cards
    let backFacesImage = document.querySelectorAll(".flipped .back i");

    // if the dataset name of the first image = to the dataset name of the second one
    if (backFacesImage[0].dataset.name === backFacesImage[1].dataset.name) {
      // add the class mathced to the clicked cards and remove the flipped class
      // and also add disable-click class to both cards to disable further clicks on them
      for (let i = 0; i < 2; i++) {
        backFacesImage[i].parentElement.parentElement.classList.add("matched");
        backFacesImage[i].parentElement.parentElement.classList.remove(
          "flipped"
        );
        backFacesImage[i].parentElement.parentElement.classList.add(
          "disable-click"
        );
      }

      // if the back face image of the two cards are not the same then
    } else {
      // incrase the number of mistakes
      incrementMistakes();

      // disable clicking for the duration (1 sec)
      disableClick();

      // after duration (1 sec) remove the flipped class from both cards
      setTimeout(function () {
        for (let i = 0; i < 2; i++) {
          backFacesImage[i].parentElement.parentElement.classList.remove(
            "flipped"
          );
        }
      }, duration);
    }
  }
}

// this function adds the disable click class which disable pointer event to the cards container
// and after the duration it removes this class
function disableClick() {
  cardsContainer.classList.add("disable-click");

  setTimeout(function () {
    cardsContainer.classList.remove("disable-click");
  }, duration);
}

function incrementMistakes() {
  mistakes.textContent = parseInt(mistakes.textContent) + 1;
}

// the game timer and it also checks for the state of the game each interval
function Timer() {
  let timer = document.querySelector(".game-container .timer span");
  let seconds = 0,
    mins = 0;

  let counter = setInterval(() => {
    if (finishState) {
      clearInterval(counter);
      endGame(seconds);
    } else {
      seconds++;
      mins = Math.floor(seconds / 60);
      if (seconds % 60 < 10) {
        timer.textContent = `${mins}:0${seconds % 60}`;
      } else {
        timer.textContent = `${mins}:${seconds % 60}`;
      }
    }
  }, 1000);
}

// counts the number of the matched cards (correctly chosen cards)
function countMatched(cards) {
  let matchedNumber = 0;

  cards.forEach((card) => {
    if (card.classList.contains("matched")) {
      matchedNumber++;
    }
  });

  return matchedNumber;
}

function endGame(seconds) {
  let endGameScreen = document.createElement("div");
  endGameScreen.className = "end-game-screen";
  let time = document.querySelector(".game-container .timer span");

  let score = document.createElement("div");
  score.className = "score";

  let congrats = document.createElement("span");
  congrats.className = "congrats";
  congrats.appendChild(document.createTextNode("Congratulations!"));
  score.appendChild(congrats);

  let timeScore = document.createElement("div");
  timeScore.className = "time-score";
  timeScore.innerHTML = `Your time is <span>${time.textContent}</span>`;
  score.appendChild(timeScore);

  let mistakesScore = document.createElement("div");
  mistakesScore.className = "mistakes-score";
  mistakesScore.innerHTML = `Number of mistakes <span>${mistakes.textContent}</span>`;
  score.appendChild(mistakesScore);

  let playAgain = document.createElement("div");
  playAgain.className = "play-again";
  playAgain.appendChild(document.createTextNode("Play Again"));
  playAgain.addEventListener("click", () => {
    mistakes.textContent = "0";
    document.querySelector(".game-container .timer span").textContent = `0:00`;
    cardsContainer.innerHTML = "";
    finishState = false;
    document.querySelector(".start-screen").style.display = "flex";
    endGameScreen.style.display = "none";
  });
  score.appendChild(playAgain);

  endGameScreen.appendChild(score);
  document.body.appendChild(endGameScreen);

  saveToLeaderBoard(seconds);
}

// after finishing the game, save the score to the leader board
function saveToLeaderBoard(seconds) {
  let level = checkLevel();
  if (localStorage.getItem("scores")) {
    let scores = JSON.parse(localStorage.getItem("scores"));
    scores.push({
      name: player.textContent,
      time: seconds,
      mistakes: parseInt(mistakes.textContent),
      level,
    });

    localStorage.setItem("scores", JSON.stringify(scores));
  } else {
    let scores = [
      {
        name: player.textContent,
        time: seconds,
        mistakes: parseInt(mistakes.textContent),
        level,
      },
    ];
    localStorage.setItem("scores", JSON.stringify(scores));
  }

  // clear the leader board first before appending to it the scores
  leaderBoard.innerHTML = `<div> <h2>Leader Board</h2> <div class="scores"></div></div>`;
  sortLeaderBoard();
}

function checkLevel() {
  let level;
  switch (numberOfCards) {
    case 10:
      level = "easy";
      break;
    case 20:
      level = "medium";
      break;
    case 40:
      level = "hard";
      break;
    case 60:
      level = "very hard";
      break;
  }

  return level;
}

function sortLeaderBoard() {
  if (localStorage.getItem("scores")) {
    let scores = JSON.parse(localStorage.getItem("scores"));

    let easy = [],
      medium = [],
      hard = [],
      veryHard = [];
    scores.forEach((score) => {
      if (score.level === "easy") {
        easy.push(score);
      } else if (score.level === "medium") {
        medium.push(score);
      } else if (score.level === "hard") {
        hard.push(score);
      } else if (score.level === "very hard") {
        veryHard.push(score);
      }
    });
    sortScore(easy);
    sortScore(medium);
    sortScore(hard);
    sortScore(veryHard);

    displayLeaderBoard(easy, medium, hard, veryHard);
  }
}

// sort array of scores according to mistakes first then time second
function sortScore(scores) {
  for (let i = 0; i < scores.length - 1; i++) {
    for (let j = i + 1; j < scores.length; j++) {
      if (scores[i].mistakes > scores[j].mistakes) {
        [scores[i], scores[j]] = [scores[j], scores[i]];
      } else if (scores[i].mistakes === scores[j].mistakes) {
        if (scores[i].time > scores[j].time) {
          [scores[i], scores[j]] = [scores[j], scores[i]];
        }
      }
    }
  }
}

function displayLeaderBoard(easy, medium, hard, veryHard) {
  display(easy);
  display(medium);
  display(hard);
  display(veryHard);
}

function display(scores) {
  if (scores.length) {
    let scoresArea = document.querySelector(".start-screen .scores");
    let level = scores[0].level;
    let scoreBody = document.createElement("div");
    scoreBody.className = "score-body";

    let scoreTitle = document.createElement("h3");
    scoreTitle.className = "score-title";
    scoreTitle.appendChild(document.createTextNode(level));
    scoreBody.appendChild(scoreTitle);

    scores.forEach((score) => {
      let div = document.createElement("div");
      let secs = score.time % 60;
      let mins = Math.floor(score.time / 60);
      if (secs < 10) {
        secs = "0" + secs;
      }
      div.innerHTML = `Name: ${score.name} | Mistakes: ${score.mistakes} | Time: ${mins}:${secs}`;
      scoreBody.appendChild(div);
    });
    scoresArea.appendChild(scoreBody);
  }
}

function displayOnLoad() {
  sortLeaderBoard();
}

/* 
  This is my idea of disbling a click for a period of time (bad one)

  function disableClick() {
  let cardsContainer = document.querySelector(".cards-container");
  let cardsContainerCover = document.createElement("div");
  cardsContainerCover.className = "cards-container-cover";
  cardsContainer.appendChild(cardsContainerCover);
  cardsContainer.addEventListener("click", function (e) {
    e.preventDefault;
  });

  setTimeout(function () {
    cardsContainerCover.remove();
  }, duration);
}
*/
