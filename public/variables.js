class GameElements {
  constructor() {
    this.gameContainer = document.querySelector(".game-container");
    this.answerPart = document.querySelector(".answer-part");
    this.answerTitle = document.querySelector(".answer-title");
    this.wrongAnswer = document.querySelector(".wrong-answer");
    this.correctAnswer = document.querySelector(".correct-answer");
    this.cancelButton = document.querySelector(".cancel-button");
    this.groundImage = document.querySelector(".ground-image");
    this.nextLevelButton = document.querySelector(".next-level-button");
    this.tutorialTitle = document.querySelector(".tutorial-title");
  }
}

class GameVariables {
  gameFinish = false;
  isTutorialEnd = false;
  getLetterIndex = 0;
  tutorialLetterIndex = 0;
  counterBall = 0;
  createBallInterval = null;
  canClick = false;
  correctWordList = ["WORK", "SAVE", "LUNA", "SON"];
  balls = [];
  destroyBalls = [];
  randomLetterList = [];
  getLettersList = [];
}

export const gameVariables = new GameVariables();

export const gameElements = new GameElements();
