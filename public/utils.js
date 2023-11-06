import { gameElements, gameVariables } from "./variables.js";

export const endTutorial = () => {
  gameVariables.isTutorialEnd = true;
  gameVariables.canClick = true;
  gameElements.tutorialTitle.style.display = "none";
};

const equalDestroyBallsToBalls = () => {
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
  gameVariables.randomLetterList.push(
    ...firstPart,
    ...secondPart,
    ...thirdPart
  );
};

const addBallToDestroyBalls = (ball) => {
  gameVariables.destroyBalls.push(ball);

  return gameVariables.destroyBalls.length - 1;
};

const handleNextLevelClick = (callCreateBallFunction, world, engine) => {
  if (!gameVariables.isTutorialEnd) {
    endTutorial();
  }

  if (!gameVariables.gameFinish) {
    removeAndClearBalls(world, engine);
    nextLevelPrepare(callCreateBallFunction, 6);
  }
};

export const clickCancelButton = () => {
  gameElements.groundImage.src = "assets/orange-pane.png";
  gameElements.wrongAnswer.style.display = "none";
  gameElements.correctAnswer.style.display = "none";
  gameElements.answerTitle.textContent = "";

  gameVariables.destroyBalls.forEach((ball) => {
    changeColorOfLetter(ball, "#c66f4f", gameVariables.getLettersList);
    ball.render.sprite.texture = "assets/new-bubble-white.png";
  });
  gameVariables.destroyBalls.splice(0, gameVariables.destroyBalls.length);
};

export const checkElementHasAlreadyInclude = (ball) => {
  const index = removeBallFromDestroyBalls(ball);

  if (gameVariables.isTutorialEnd && index !== -1) {
    changeColorOfLetter(ball, "#c66f4f", gameVariables.getLettersList);
    changeColorOfBall(ball, "assets/new-bubble-white.png");
    gameElements.answerTitle.textContent =
      gameElements.answerTitle.textContent.slice(0, index) +
      gameElements.answerTitle.textContent.slice(index + 1);
  } else if (gameElements.answerTitle.textContent.length < 4) {
    addBallToDestroyBalls(ball);
    changeColorOfLetter(ball, "white", gameVariables.getLettersList);
    gameElements.answerTitle.textContent += ball.label;
    changeColorOfBall(ball, "assets/newCircle.png");
  }
};

const continueToDestroyBalls = (world, engine) => {
  const ballToDestroy = gameVariables.destroyBalls[0];
  hideBall(ballToDestroy, world, engine);

  const letterIndex = gameVariables.getLettersList.findIndex(
    (h1) => ballToDestroy.label == h1.textContent
  );
  if (letterIndex !== -1) {
    removeLetterFromList(
      gameVariables.getLettersList[letterIndex],
      gameElements.gameContainer
    );
  }

  gameVariables.destroyBalls.splice(0, 1);
};

const noLeftBallAndFinishGame = (world, engine) => {
  if (gameVariables.destroyBalls.length > 0) {
    continueToDestroyBalls(world, engine);
  } else {
    hiddenAnswerTitle();
  }
};

const gameFinishFunction = (world, engine) => {
  //User Cant Choose Ball While They Are Destroying
  gameVariables.canClick = false;
  gameElements.answerTitle.textContent = "";
  gameElements.groundImage.src = "assets/orange-pane.png";
  gameElements.wrongAnswer.style.display = "none";
  gameElements.correctAnswer.style.display = "none";
  //Destroy All Balls
  equalDestroyBallsToBalls();
  gameVariables.balls.forEach((element) => {
    element.isStatic = true;
  });

  setInterval(() => {
    noLeftBallAndFinishGame(world, engine);
  }, 50);
};

export const checkWordIsCorrect = (createBallFunction, world, engine) => {
  switch (gameElements.answerTitle.textContent) {
    case gameVariables.correctWordList[0]: //Burayo değiştir
    case gameVariables.correctWordList[1]:
    case gameVariables.correctWordList[2]:
      handleCorrectAnswer();
      gameElements.nextLevelButton.addEventListener("click", () =>
        handleNextLevelClick(createBallFunction, world, engine)
      );
      break;
    case gameVariables.correctWordList[3]:
      handleCorrectAnswer();
      gameVariables.gameFinish = true;
      gameElements.nextLevelButton.addEventListener("click", () =>
        gameFinishFunction(world, engine)
      );
      break;
    default:
      handleDefaultAnswer();
  }
};

export const startGame = (createBallFunction,createBallNumber) => createBallFunction(createBallNumber);

export const createHandImage = () => {
  const handImage = document.createElement("img");
  handImage.className = "hand-img";
  gameElements.gameContainer.appendChild(handImage);
};

export const getNextIndex = () => gameVariables.tutorialLetterIndex;

const nextLevelPrepare = (createBall, createBallNumber) => {
  gameElements.groundImage.src = "assets/orange-pane.png";
  gameElements.correctAnswer.style.display = "none";
  gameElements.answerTitle.textContent = "";
  gameVariables.destroyBalls.splice(0, gameVariables.destroyBalls.length);

  createBall(createBallNumber);
};

const removeAndClearBalls = (world, engine) => {
  gameVariables.getLettersList = clearGetLettersList(
    gameVariables.destroyBalls,
    gameVariables.getLettersList,
    gameElements
  );
  for (const destroyBall of gameVariables.destroyBalls) {
    if (destroyBall?.parent) {
      destroyBall.parent.isSensor = true;
    }

    destroyBall.render.visible = false;
    world.remove(engine.world, destroyBall);
    const indexInBalls = gameVariables.balls.indexOf(destroyBall);

    if (indexInBalls !== -1) {
      gameVariables.balls.splice(indexInBalls, 1);
    }
  }
};

const hideBall = (ball, world, engine) => {
  ball.render.visible = false;
  world.remove(engine.world, ball);
};

const removeBallFromDestroyBalls = (ball) => {
  const index = gameVariables.destroyBalls.indexOf(ball);
  if (index !== -1) {
    gameVariables.destroyBalls.splice(index, 1);

    return index;
  }
  return -1;
};

const hiddenAnswerTitle = () =>
  setTimeout(() => {
    gameElements.answerPart.className = "make-visible-answer-part";
  }, 500);

const removeLetterFromList = (letter, whichObject) => {
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

const handleCorrectAnswer = () => {
  gameElements.groundImage.src = "assets/green-pane.png";
  gameElements.wrongAnswer.style.display = "none";
  gameElements.correctAnswer.style.display = "block";
};

const handleDefaultAnswer = () => {
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
