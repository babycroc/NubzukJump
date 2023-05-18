<script>
  import P5 from "p5-svelte";
  import { navigate } from "svelte-routing";

  import { Nubzuk } from "./Nubzuk";
  import { Objects } from "./Objects";
  import { delay } from "./utils";
  import {
    DT,
    NUBZUK_INIT_Y,
    SCORE_DISPLAY_HEIGHT,
    SCORE_DISPLAY_WIDTH,
    SCORE_DISPLAY_MARGIN,
  } from "./constants";
  import { socket } from "./socket";

  let nubzuk;
  let objects;
  let serialInput = 0;
  let score = 0;

  const drawScore = (p5, x, y) => {
    p5.fill("#ffffff");
    p5.stroke("#000000");
    p5.strokeWeight(1);
    p5.rectMode(p5.CENTER);
    p5.rect(x, y, SCORE_DISPLAY_WIDTH, SCORE_DISPLAY_HEIGHT);

    p5.fill("#000000");
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textFont("Arial");
    p5.textSize(18);
    p5.text(`Score: ${score}`, x, y);
  };

  const sketch = (p5) => {
    p5.preload = () => {};
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzuk = Nubzuk.getInstance(p5);

      objects = Objects.getInstance();
      objects.createPlatforms(p5);
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

      nubzuk.jump();

      socket.on("serial", function (data) {
        const newSerialInput = data;
        if (serialInput != newSerialInput) serialInput = newSerialInput;
      });
      nubzuk.move(p5, serialInput);
      //   if (p5.keyIsDown(p5.LEFT_ARROW)) nubzuk.move(p5, -1);
      //   if (p5.keyIsDown(p5.RIGHT_ARROW)) nubzuk.move(p5, 1);

      if (nubzuk.vy < 0) {
        for (const platform of objects.getPlatforms()) {
          if (nubzuk.onPlatform(platform)) {
            const shiftHeight = platform.y - NUBZUK_INIT_Y;
            if (shiftHeight > 5) {
              score += shiftHeight;
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
          navigate("/score");
        }
      }

      if (nubzuk.y + nubzuk.size < 0) {
        navigate("/score");
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
