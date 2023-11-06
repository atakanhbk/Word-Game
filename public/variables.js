export let balls = [];

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

  export const gameElements = new GameElements();



  export const randomLetterList = [];

  export const spawnLetterList = () => {
    const firstPart = [
      "W",
      "B",
      "O",
      "S",
      "R",
      "F",
      "G",
      "H",
      "J",
      "Z",
      "A",
      "Y",
      "K",
    ];
    const secondPart = ["V", "E", "L", "U", "P", "X"];
    const thirdPart = [
      "W",
      "D",
      "N",
      "A",
      "Q",
      "R",
      "A",
      "N",
      "Ğ",
      "O",
      "S",
      "K",
    ];

    // Assign the values to the global variable
    randomLetterList.push(...firstPart, ...secondPart, ...thirdPart);
  };

