import {
  balls,
  gameElements,
  randomLetterList,
  spawnLetterList,
  destroyBalls,
  equalDestroyBallsToBalls,
} from "./variables.js";

import {
  hiddenAnswerTitle,
  removeLetterFromList,
  changeColorOfBall,
  changeColorOfLetter,
  reduceBallShaking,
  createGround,
  createWall,
  ShowClickTickTitle,
  handleCorrectAnswer,
  handleDefaultAnswer,
  clearGetLettersList
} from "./utilities.js";

document.addEventListener("DOMContentLoaded", function () {


  const { Engine, Render, Runner, Bodies, World, Bounds } = Matter;

  let isTutorialEnd = false;

  
  const engine = Engine.create();
  const render = Render.create({
    element: gameElements.gameContainer,
    engine: engine,
    options: {
      width: 500,
      height: 400,
      wireframes: false,
    },
  });
  const canvas = render.canvas;

  Render.run(render);
  Runner.run(Runner.create(), engine);

  const ground = createGround(Bodies);
  World.add(engine.world, ground);

  let getLetterIndex = 0;

  reduceBallShaking(engine, 50);

  spawnLetterList();

  let createBallInterval = null;

  const createBall = (ballNumber) => {
    let counter = 0;
    if (createBallInterval !== null) {
      clearInterval(createBallInterval);
    }
    createBallInterval = setInterval(() => {
      const ball = Bodies.circle(250, 12, 33, {
        label: randomLetterList[getLetterIndex],
        render: {
          fillStyle: "#C96336",
          text: { content: "A", color: "black", size: 150 },
          sprite: {
            texture: "assets/new-bubble-white.png",
            xScale: 1,
            yScale: 1,
          },
        },
      });

      getLetterIndex++;
      balls.push(ball);
      World.add(engine.world, ball);
      counter++;
      getLetters(ball);

      if (counter >= ballNumber) {
        createHandTutorial("W");
        clearInterval(createBallInterval);
      }
    }, 300);
  };

  const handImage = document.createElement("img");
  handImage.className = "hand-img";

  gameElements.gameContainer.appendChild(handImage);

  const createHandTutorial = (ballLabel) => {
    const gameContainer = gameElements.gameContainer;
    const handImage = gameContainer.querySelector(".hand-image");

    if (handImage !== null) {
      gameElements.gameContainer.removeChild(handImage);
    }

    if (ballLabel !== "" && !isTutorialEnd) {
      setTimeout(() => {
        canClick = true;
        gameElements.tutorialTitle.style.display = "block";
        const ball = balls.find((element) => element.label === ballLabel);
        changeColorOfLetter(ball, "white", getLettersList);
        changeColorOfBall(ball, "assets/newCircle.png");

        const handImage = document.createElement("img");
        handImage.className = "hand-image";
        handImage.src = "assets/hand.png";
        gameElements.gameContainer.appendChild(handImage);

        const handImageMatter = {
          w: 500,
          h: 500,
          body: ball,
          elem: handImage,
          scale: 1.0,
          growing: true,
          render() {
            const { x, y } = this.body.position;
            const transformValue = `translate(${x - this.w / 2.25}px, ${
              y - this.h / 1000
            }px) scale(${this.scale})`;
            this.elem.style.transform = transformValue;

            const step = 0.01;

            if (this.growing) {
              this.scale += step;
            } else {
              this.scale -= step;
            }

            if (this.scale >= 1.5 || this.scale <= 1) {
              this.growing = !this.growing;
            }
          },
        };
        Matter.Composite.add(engine.world, [handImageMatter.body]);

        function loop() {
          handImageMatter.render();
          requestAnimationFrame(loop);
        }
        loop();
        Matter.Composite.remove(engine.world, [handImageMatter.body]);
      }, 1000);
    }
  };

  const startGame = () => createBall(13);
  startGame();

  let getLettersList = [];

  const getLetters = (ball) => {
    const h1 = document.createElement("h1");
    h1.textContent = ball.label;
    h1.className = "ballLetter";
    h1.style.pointerEvents = "none";
    gameElements.gameContainer.appendChild(h1);
    getLettersList.push(h1);
    const ballLetter = {
      w: 500,
      h: 500,
      body: ball,
      elem: h1,
      render() {
        const { x, y } = this.body.position;
        const transformValue = `translate(${x - this.w / 2}px, ${
          y - this.h / 10
        }px)`;
        this.elem.style.transform = transformValue;
      },
    };
    Matter.Composite.add(engine.world, [ballLetter.body]);
    function rerender() {
      ballLetter.render();
      requestAnimationFrame(rerender);
    }
    rerender();
  };

  const nextLevelPrepare = () => {
    gameElements.groundImage.src = "assets/orange-pane.png";
    gameElements.correctAnswer.style.display = "none";
    gameElements.answerTitle.textContent = "";
    destroyBalls.splice(0, destroyBalls.length);

    createBall(6);
  };

  createWall(Bodies, World, engine);

  Engine.run(engine);

  let gameFinish = false;
  let tutorialLetterIndex = 0;
  let canClick = false;

  const clickBall = () => {
    if (canClick) {
      const mousePosition = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
      };
      function clearAllGetLettersList() {
        getLettersList.forEach((h1) => {
          gameElements.gameContainer.removeChild(h1);
        });
        getLettersList = [];
      }
      balls.forEach((ball, index) => {
        if (Bounds.contains(ball.bounds, mousePosition)) {
          if (!isTutorialEnd) {
            tutorialModeClick(ball);
          } else {
            unTutorialModeClick(ball);
          }
        }
      });
    }
  };

  const tutorialModeClick = (ball) => {
    if (ball.label === "W" && tutorialLetterIndex === 0) {
      handleTutorialStep("O", ball);
    } else if (ball.label === "O" && tutorialLetterIndex === 1) {
      handleTutorialStep("R", ball);
    } else if (ball.label === "R" && tutorialLetterIndex === 2) {
      handleTutorialStep("K", ball);
    } else if (ball.label === "K" && tutorialLetterIndex === 3) {
      handleTutorialStep("", ball);
    }
  };

  const unTutorialModeClick = (ball) => {
    gameElements.wrongAnswer.style.display = "block";
    gameElements.correctAnswer.style.display = "none";
    gameElements.groundImage.src = "assets/gray-pane.png";
    tutorialLetterIndex++;
    checkElementHasAlreadyInclude(ball);
    checkWordIsCorrect();
    createHandTutorial("O");
    gameElements.cancelButton.addEventListener("click", clickCancelButton);
  };

  const handleTutorialStep = (nextLetter, ball) => {
    if (tutorialLetterIndex === getNextIndex()) {
      gameElements.tutorialTitle.style.transform = "translate(-450px)";
      gameElements.wrongAnswer.style.display = "block";
      gameElements.correctAnswer.style.display = "none";
      gameElements.groundImage.src = "assets/gray-pane.png";
      tutorialLetterIndex++;
      checkElementHasAlreadyInclude(ball);
      checkWordIsCorrect();
      createHandTutorial(nextLetter);
      canClick = false;
    }

    ShowClickTickTitle(nextLetter, gameElements.tutorialTitle);
  };

  const getNextIndex = () => {
    return tutorialLetterIndex;
  };

  const hideBall = (ball) => {
    ball.render.visible = false;
    World.remove(engine.world, ball);
  };

  const noLeftBallAndFinishGame = () => {
    if (destroyBalls.length > 0) {
      continueToDestroyBalls();
    } else {
      hiddenAnswerTitle(gameElements.answerPart);
    }
  };

  const continueToDestroyBalls = () => {
    const ballToDestroy = destroyBalls[0];
    hideBall(ballToDestroy);

    const letterIndex = getLettersList.findIndex(
      (h1) => ballToDestroy.label == h1.textContent
    );
    if (letterIndex !== -1) {
      removeLetterFromList(
        getLettersList[letterIndex],
        gameElements.gameContainer
      );
    }

    destroyBalls.splice(0, 1);
  };

  const gameFinishFunction = () => {
    gameElements.answerTitle.textContent = "";
    gameElements.groundImage.src = "assets/orange-pane.png";
    gameElements.wrongAnswer.style.display = "none";
    gameElements.correctAnswer.style.display = "none";
    equalDestroyBallsToBalls();
    balls.forEach((element) => {
      element.isStatic = true;
    });
    let elementIndex = 0;
    setInterval(() => {
      noLeftBallAndFinishGame();
    }, 50);
  };

  const endTutorial = () => {
    isTutorialEnd = true;
    canClick = true;
    gameElements.tutorialTitle.style.display = "none";
    console.log(isTutorialEnd);
  };

  const removeAndClearBalls = () => {
    getLettersList = clearGetLettersList(destroyBalls, getLettersList, gameElements);
    for (const destroyBall of destroyBalls) {
      if (destroyBall?.parent) {
        destroyBall.parent.isSensor = true;
      }
      destroyBall.render.visible = false;
      World.remove(engine.world, destroyBall);
      const indexInBalls = balls.indexOf(destroyBall);
      if (indexInBalls !== -1) {
        balls.splice(indexInBalls, 1);
      }
    }
  };

  const handleNextLevelClick = () => {
    if (!isTutorialEnd) {
      endTutorial();
    }

    if (!gameFinish) {
      removeAndClearBalls();
      nextLevelPrepare();
    }
  };

  const removeBallFromDestroyBalls = (ball) => {
    const index = destroyBalls.indexOf(ball);
    if (index !== -1) {
      destroyBalls.splice(index, 1);
      return index;
    }
    return -1;
  };

  const addBallToDestroyBalls = (ball) => {
    destroyBalls.push(ball);
    return destroyBalls.length - 1;
  };

  const checkElementHasAlreadyInclude = (ball) => {
    const index = removeBallFromDestroyBalls(ball);

    if (isTutorialEnd && index !== -1) {
      changeColorOfLetter(ball, "#c66f4f", getLettersList);
      changeColorOfBall(ball, "assets/new-bubble-white.png");
      gameElements.answerTitle.textContent =
        gameElements.answerTitle.textContent.slice(0, index) +
        gameElements.answerTitle.textContent.slice(index + 1);
    } else if (gameElements.answerTitle.textContent.length < 4) {
      const newIndex = addBallToDestroyBalls(ball);
      changeColorOfLetter(ball, "white", getLettersList);
      gameElements.answerTitle.textContent += ball.label;
      changeColorOfBall(ball, "assets/newCircle.png");
    }
  };

  const checkWordIsCorrect = () => {
    switch (gameElements.answerTitle.textContent) {
      case "WORK":
      case "SAVE":
      case "LUNA":
        handleCorrectAnswer(gameElements);
        gameElements.nextLevelButton.addEventListener(
          "click",
          handleNextLevelClick
        );
        break;
      case "SON":
        handleCorrectAnswer(gameElements);
        gameFinish = true;
        gameElements.nextLevelButton.addEventListener(
          "click",
          gameFinishFunction
        );
        break;
      default:
        handleDefaultAnswer(gameElements);
    }
  };

  const clickCancelButton = () => {
    gameElements.groundImage.src = "assets/orange-pane.png";
    gameElements.wrongAnswer.style.display = "none";
    gameElements.correctAnswer.style.display = "none";
    gameElements.answerTitle.textContent = "";

    destroyBalls.forEach((ball) => {
      changeColorOfLetter(ball, "#c66f4f", getLettersList);
      ball.render.sprite.texture = "assets/new-bubble-white.png";
    });
    destroyBalls.splice(0, destroyBalls.length);
  };
  canvas.addEventListener("click", clickBall);
  engine.world.gravity.y = 1;
});
