<script>
  import P5 from "p5-svelte";

  import { Nubzuk } from "./Nubzuk";
  import {
    createPlatforms,
    createPlatformsBetween,
    drawPlatforms,
    getPlatforms,
  } from "./platforms";
  import { delay } from "./utils";
  import { DT, NUBZUK_INIT_Y } from "./constants";
  import { socket } from "./socket";

  let nubzuk;
  let serialInput = 0;

  const sketch = (p5) => {
    p5.preload = () => {};
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzuk = Nubzuk.getInstance(p5);
      createPlatforms(p5);
    };
    p5.draw = () => {
      p5.background(255);

      drawPlatforms(p5);

      nubzuk.draw(p5);

      nubzuk.jump();

      socket.on("serial", function (data) {
        const newSerialInput = data;
        if (serialInput != newSerialInput) serialInput = newSerialInput;
      });
      nubzuk.move(p5, serialInput);
      // if (p5.keyIsDown(p5.LEFT_ARROW)) nubzuk.move(p5, -1);
      // if (p5.keyIsDown(p5.RIGHT_ARROW)) nubzuk.move(p5, 1);

      if (nubzuk.vy < 0) {
        for (const platform of getPlatforms()) {
          if (nubzuk.onPlatform(platform)) {
            const shiftHeight = nubzuk.getY() - NUBZUK_INIT_Y;
            nubzuk.toBaseline();

            createPlatformsBetween(p5, p5.height, p5.height + shiftHeight);
            getPlatforms().map(async (platform) => {
              const initialY = platform.y;
              const dy = (Math.floor(shiftHeight) / 10) * DT;
              for (let y = initialY; y > initialY - shiftHeight; y -= dy) {
                platform.y = Math.ceil(y);
                await delay(DT);
              }
            });
            // TODO: remove platforms no longer in use
          }
        }
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
