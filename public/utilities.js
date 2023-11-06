export const hiddenAnswerTitle = (hiddenObject) =>
  setTimeout(() => {
    hiddenObject.className = "make-visible-answer-part";
  }, 500);

export const removeLetterFromList = (letter, whichObje) => {
  whichObje.removeChild(letter);
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

export const createGround = (Bodies) =>
  Bodies.rectangle(250, 340, 500, 80, {
    isStatic: true,
    render: { fillStyle: "#F19648" },
  });

export const createWall = (Bodies, World, engine) => {
  const leftWall = Bodies.rectangle(-9, 200, 20, 450, {
    isStatic: true,
  });
  const rightWall = Bodies.rectangle(509, 200, 20, 400, {
    isStatic: true,
  });
  World.add(engine.world, [leftWall, rightWall]);
};

export function ShowClickTickTitle(nextLetter, tutorialTitle) {
  if (nextLetter === "") {
    tutorialTitle.style.right = "-800px";
    tutorialTitle.style.transform = "translate(-890px)";
    tutorialTitle.textContent = "TAP THE GREEN BOX TO CONFIRM";
  }
}

export const handleCorrectAnswer = (gameElements) => {
  gameElements.groundImage.src = "assets/green-pane.png";
  gameElements.wrongAnswer.style.display = "none";
  gameElements.correctAnswer.style.display = "block";
};

export const handleDefaultAnswer = (gameElements) => {
  if (gameElements.answerTitle.textContent.length === 0) {
    gameElements.groundImage.src = "assets/orange-pane.png";
    gameElements.wrongAnswer.style.display = "none";
    gameElements.correctAnswer.style.display = "none";
  }
};

