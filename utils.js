import { BirdsEyeView } from "./views/BirdsEyeView.js";

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function showMazeBuilderProgress(
  gl,
  ctx,
  textureRepo,
  floorWidth,
  floorHeight,
  walls,
  pillars,
  floorTiles,
  speedInMs,
  endWaitInMs
) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const birdsEyeView = new BirdsEyeView(
    gl,
    ctx,
    floorWidth,
    floorHeight
  );
  birdsEyeView.update();
  birdsEyeView.draw();
  const floorTexture = textureRepo.get("floor");
  const wallTexture = textureRepo.get("wall");
  const allWalls = walls.length;
  const shuffleWalls = shuffle(walls);
  for (let wallIndex = 0; wallIndex < allWalls; wallIndex++) {
    let i = 0;
    for (const wall of shuffleWalls) {
      if (i > wallIndex) {
        break;
      }
      floorTexture.activate();
      for (const floorTile of floorTiles) {
        floorTile.draw();
      }
      wallTexture.activate();
      wall.draw();
      i++;
    }
    // Using async apparently confuses WebGL (?)
    // That's why we draw incrementally.
    await sleep(speedInMs);
  }
  floorTexture.activate();
  for (const floorTile of floorTiles) {
    floorTile.draw();
  }
  for (const wall of walls) {
    wallTexture.activate();
    wall.draw();
  }
  for (const pillar of pillars) {
    pillar.draw();
  }
  floorTexture.deactivate();
  await sleep(endWaitInMs);
}
