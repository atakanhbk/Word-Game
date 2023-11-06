import { gameElements, gameVariables } from "./variables.js";

export const endTutorial = () => {
  gameVariables.isTutorialEnd = true;
  gameVariables.canClick = true;
  gameElements.tutorialTitle.style.display = "none";
};

export const equalDestroyBallsToBalls = () => {
  gameVariables.destroyBalls = gameVariables.balls;
};

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
  gameVariables.randomLetterList.push(...firstPart, ...secondPart, ...thirdPart);
};



export const hiddenAnswerTitle = () =>
  setTimeout(() => {
    gameElements.answerPart.className = "make-visible-answer-part";
  }, 500);

export const removeLetterFromList = (letter, whichObject) => {
    whichObject.removeChild(letter);
};

export const changeColorOfBall = (ball, texture) =>
  (ball.render.sprite.texture = texture);

export const changeColorOfLetter = (ball, color, list) => {
  list.forEach((element) => {
    if (ball.label === element.textContent) {
      element.style.color = color;
    }
  });
};

export const reduceBallShaking = (engine, value) => {
  engine.velocityIterations = value;
};

export const createGround = (bodies) =>
  bodies.rectangle(250, 340, 500, 80, {
    isStatic: true,
    render: { fillStyle: "#F19648" },
  });

export const createWall = (bodies, world, engine) => {
  const leftWall = bodies.rectangle(-9, 200, 20, 450, {
    isStatic: true,
  });
  const rightWall = bodies.rectangle(509, 200, 20, 400, {
    isStatic: true,
  });
  world.add(engine.world, [leftWall, rightWall]);
};

export const showClickTickTitle = (nextLetter) => {
  if (nextLetter === "") {
    gameElements.tutorialTitle.style.right = "-800px";
    gameElements.tutorialTitle.style.transform = "translate(-890px)";
    gameElements.tutorialTitle.textContent = "TAP THE GREEN BOX TO CONFIRM";
  }
};

export const handleCorrectAnswer = () => {
  gameElements.groundImage.src = "assets/green-pane.png";
  gameElements.wrongAnswer.style.display = "none";
  gameElements.correctAnswer.style.display = "block";
};

export const handleDefaultAnswer = () => {
  if (gameElements.answerTitle.textContent.length === 0) {
    gameElements.groundImage.src = "assets/orange-pane.png";
    gameElements.wrongAnswer.style.display = "none";
    gameElements.correctAnswer.style.display = "none";
  }
};

export const clearGetLettersList = (
  destroyBalls,
  getLettersList,
  gameElements
) => {
  const destroyBallLabels = destroyBalls.map((ball) => ball.label);

  const updatedGetLettersList = getLettersList.filter((element) => {
    if (destroyBallLabels.includes(element.innerHTML)) {
      gameElements.gameContainer.removeChild(element);
      
      return false;
    }

    return true; 
  });

  return updatedGetLettersList; 
};
