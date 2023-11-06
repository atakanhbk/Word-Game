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
  gameVariables.randomLetterList.push(
    ...firstPart,
    ...secondPart,
    ...thirdPart
  );
};

export const addBallToDestroyBalls = (ball) => {
  gameVariables.destroyBalls.push(ball);

  return gameVariables.destroyBalls.length - 1;
};

export const handleNextLevelClick = (callCreateBallFunction, world, engine) => {
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

export const nextLevelPrepare = (createBall, createBallNumber) => {
  gameElements.groundImage.src = "assets/orange-pane.png";
  gameElements.correctAnswer.style.display = "none";
  gameElements.answerTitle.textContent = "";
  gameVariables.destroyBalls.splice(0, gameVariables.destroyBalls.length);

  createBall(createBallNumber);
};

export const removeAndClearBalls = (world, engine) => {
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

export const hideBall = (ball, world, engine) => {
  ball.render.visible = false;
  world.remove(engine.world, ball);
};

export const removeBallFromDestroyBalls = (ball) => {
  const index = gameVariables.destroyBalls.indexOf(ball);
  if (index !== -1) {
    gameVariables.destroyBalls.splice(index, 1);

    return index;
  }
  return -1;
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
