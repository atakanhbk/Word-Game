import { gameElements, gameVariables } from "./variables.js";
import {
  changeColorOfBall,
  changeColorOfLetter,
  reduceBallShaking,
  createGround,
  createWall,
  showClickTickTitle,
  spawnLetterList,
  clickCancelButton,
  checkElementHasAlreadyInclude,
  checkWordIsCorrect,
  getNextIndex,
  createHandImage,
  startGame,
} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
  const { Engine, Render, Runner, Bodies, World, Bounds } = Matter;
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
  reduceBallShaking(engine, 50);
  spawnLetterList();

  const createBall = (ballNumber) => {
    gameVariables.counterBall = 0;
    if (gameVariables.createBallInterval !== null) {
      clearInterval(gameVariables.createBallInterval);
    }
    gameVariables.createBallInterval = setInterval(() => {
      const ball = Bodies.circle(250, 12, 33, {
        label: gameVariables.randomLetterList[gameVariables.getLetterIndex],
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

      gameVariables.getLetterIndex++;
      gameVariables.balls.push(ball);
      World.add(engine.world, ball);
      gameVariables.counterBall++;
      getLetters(ball);

      if (gameVariables.counterBall >= ballNumber) {
        createHandTutorial("W");
        clearInterval(gameVariables.createBallInterval);
      }
    }, 300);
  };

  startGame(createBall, 13);
  createHandImage();

  const createHandTutorial = (ballLabel) => {
    const gameContainer = gameElements.gameContainer;
    const handImage = gameContainer.querySelector(".hand-image");

    if (handImage !== null) {
      gameElements.gameContainer.removeChild(handImage);
    }

    if (ballLabel !== "" && !gameVariables.isTutorialEnd) {
      setTimeout(() => {
        gameVariables.canClick = true;
        gameElements.tutorialTitle.style.display = "block";
        const ball = gameVariables.balls.find(
          (element) => element.label === ballLabel
        );
        changeColorOfLetter(ball, "white", gameVariables.getLettersList);
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

  const getLetters = (ball) => {
    const h1 = document.createElement("h1");
    h1.textContent = ball.label;
    h1.className = "ballLetter";
    h1.style.pointerEvents = "none";
    gameElements.gameContainer.appendChild(h1);
    gameVariables.getLettersList.push(h1);
    const ballLetter = {
      w: 500,
      h: 500,
      body: ball,
      elem: h1,
      render() {
        const { x, y } = this.body.position;
        const transformValue = `translate(${x - this.w / 2}px, ${
          y - this.h / 11
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

  createWall(Bodies, World, engine);
  Engine.run(engine);

  const clickBall = () => {
    if (gameVariables.canClick) {
      const mousePosition = {
        x: event.clientX - canvas.getBoundingClientRect().left,
        y: event.clientY - canvas.getBoundingClientRect().top,
      };

      gameVariables.balls.forEach((ball) => {
        if (Bounds.contains(ball.bounds, mousePosition)) {
          if (!gameVariables.isTutorialEnd) {
            tutorialModeClick(ball);
          } else {
            unTutorialModeClick(ball);
          }
        }
      });
    }
  };

  const tutorialModeClick = (ball) => {
    if (ball.label === "W" && gameVariables.tutorialLetterIndex === 0) {
      handleTutorialStep("O", ball);
    } else if (ball.label === "O" && gameVariables.tutorialLetterIndex === 1) {
      handleTutorialStep("R", ball);
    } else if (ball.label === "R" && gameVariables.tutorialLetterIndex === 2) {
      handleTutorialStep("K", ball);
    } else if (ball.label === "K" && gameVariables.tutorialLetterIndex === 3) {
      handleTutorialStep("", ball);
    }
  };

  const unTutorialModeClick = (ball) => {
    gameElements.wrongAnswer.style.display = "block";
    gameElements.correctAnswer.style.display = "none";
    gameElements.groundImage.src = "assets/gray-pane.png";
    gameVariables.tutorialLetterIndex++;
    checkElementHasAlreadyInclude(ball);
    checkWordIsCorrect(createBall, World, engine);
    createHandTutorial("O");
    gameElements.cancelButton.addEventListener("click", clickCancelButton);
  };

  const handleTutorialStep = (nextLetter, ball) => {
    if (gameVariables.tutorialLetterIndex === getNextIndex()) {
      gameElements.tutorialTitle.style.transform = "translate(-450px)";
      gameElements.wrongAnswer.style.display = "block";
      gameElements.correctAnswer.style.display = "none";
      gameElements.groundImage.src = "assets/gray-pane.png";
      gameVariables.tutorialLetterIndex++;
      checkElementHasAlreadyInclude(ball);
      checkWordIsCorrect(createBall, World, engine);
      createHandTutorial(nextLetter);
      gameVariables.canClick = false;
    }

    showClickTickTitle(nextLetter);
  };

  canvas.addEventListener("click", clickBall);
});
