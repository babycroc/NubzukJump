<script>
  import P5 from "p5-svelte";
  import { ref, get } from "firebase/database";

  import { Nubzuk } from "./Nubzuk";
  import { Objects } from "./Objects";
  import { delay } from "./utils";
  import {
    DT,
    NUBZUK_INIT_Y,
    SCORE_DISPLAY_HEIGHT,
    SCORE_DISPLAY_WIDTH,
    SCORE_DISPLAY_MARGIN,
    SCORE_MARKER_LENGTH,
    PICKET_WIDTH,
    PICKET_HEIGHT,
  } from "./constants";
  import { socket } from "./socket";
  import { database } from "./firebase";
  import arrow from "./lib/assets/ArrowUp.png";

  let nubzuk;
  let objects;
  let serialInput = 0;
  let currentScore = 0;
  let scoreBoard = [];
  let arrowIcon;

  const dbRef = ref(database, "/");
  const loadData = () => {
    get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) scoreBoard = data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const drawScore = (p5, x, y) => {
    // scoreboard results
    scoreBoard.map((score) => {
      const scoreDiff = score.score - currentScore;
      if (scoreDiff > 0 && scoreDiff < p5.height) {
        const canvasY = p5.height - scoreDiff;

        p5.stroke("#000000");
        p5.strokeWeight(1);
        p5.line(p5.width - SCORE_MARKER_LENGTH, canvasY, p5.width, canvasY);

        p5.fill("#000000");
        p5.noStroke();
        p5.textAlign(p5.RIGHT, p5.BOTTOM);
        p5.textSize(16);
        p5.text(`${score.nickname}`, p5.width - 10, canvasY);
      }
    });

    // current score
    p5.fill("#40A0D2");
    p5.noStroke();
    p5.rectMode(p5.CENTER);
    p5.rect(
      x,
      y,
      SCORE_DISPLAY_WIDTH,
      SCORE_DISPLAY_HEIGHT,
      SCORE_DISPLAY_WIDTH / 2
    );

    p5.fill("#ffffff");
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont("Arial");
    p5.textSize(18);
    p5.text(`Score: ${currentScore}`, x, y);
  };

  const drawPicket = (p5) => {
    const picketX = p5.width / 2;
    const picketY = PICKET_HEIGHT;
    p5.fill("#ffffff");
    p5.stroke("#000000");
    p5.strokeWeight(1);
    p5.rectMode(p5.CENTER);
    p5.rect(picketX, picketY, PICKET_WIDTH, PICKET_HEIGHT);

    p5.imageMode(p5.CENTER);
    p5.image(arrowIcon, picketX - PICKET_WIDTH / 2 + 25, picketY - 1, 18, 18);
    p5.image(arrowIcon, picketX + PICKET_WIDTH / 2 - 25, picketY - 1, 18, 18);

    p5.fill("#000000");
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(18);
    p5.text("GRADUATION UP AHEAD", picketX, picketY);
  };

  const sketch = (p5) => {
    p5.preload = () => {
      arrowIcon = p5.loadImage(arrow);
    };
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzuk = Nubzuk.getInstance(p5);

      objects = Objects.getInstance();
      objects.createPlatforms(p5);

      loadData();
    };
    p5.draw = () => {
      p5.background(255);

      objects.draw(p5);
      nubzuk.draw(p5);
      drawScore(
        p5,
        p5.width - SCORE_DISPLAY_WIDTH / 2 - SCORE_DISPLAY_MARGIN,
        SCORE_DISPLAY_MARGIN
      );
      drawPicket(p5);

      nubzuk.jump();

      socket.on("serial", function (data) {
        const newSerialInput = data;
        if (serialInput != newSerialInput) serialInput = newSerialInput;
      });
      nubzuk.move(p5, serialInput);
      // if (p5.keyIsDown(p5.LEFT_ARROW)) nubzuk.move(p5, -1);
      // if (p5.keyIsDown(p5.RIGHT_ARROW)) nubzuk.move(p5, 1);

      if (nubzuk.vy < 0) {
        for (const platform of objects.getPlatforms()) {
          if (nubzuk.onPlatform(platform)) {
            const shiftHeight = platform.y - NUBZUK_INIT_Y;
            if (shiftHeight > 5) {
              currentScore += shiftHeight;
            }

            nubzuk.toBaseline();

            objects.createObjectsBetween(
              p5,
              p5.height,
              p5.height + shiftHeight,
              true
            );
            objects.getObjects().map(async (object) => {
              const initialY = object.y;
              const dy = (Math.floor(shiftHeight) / 10) * DT;
              for (let y = initialY; y > initialY - shiftHeight; y -= dy) {
                object.shiftTo(Math.ceil(y));
                await delay(DT);
              }
            });
            const updatedPlatforms = objects
              .getPlatforms()
              .filter((x) => x.y > 0);
            const updatedObstacles = objects
              .getObstacles()
              .filter((x) => x.y > 0);
            objects.setPlatforms(updatedPlatforms);
            objects.setObstacles(updatedObstacles);
          }
        }
      }

      for (const obstacle of objects.getObstacles()) {
        if (nubzuk.meetsObstacle(obstacle)) {
          localStorage.setItem("score", currentScore);
          localStorage.setItem("saved", false);
          window.location.href = "/score";
        }
      }

      if (nubzuk.y + nubzuk.size < 0) {
        localStorage.setItem("score", currentScore);
        localStorage.setItem("saved", false);
        window.location.href = "/score";
      }
    };
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };
  };
</script>

<main>
  <P5 {sketch} />
</main>

<style>
  main {
    text-align: center;
  }
</style>
