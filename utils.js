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
  floorWalls,
  speedInMs,
  endWaitInMs
) {
  const birdsEyeView = new BirdsEyeView(
    gl,
    ctx,
    floorWidth,
    floorHeight
  );
  birdsEyeView.update();
  birdsEyeView.draw();
  const floorTexture = textureRepo.get("beton_floor");
  const wallTexture = textureRepo.get("beton_wall");
  const allWalls = walls.length;
  const shuffleWalls = shuffle(walls);
  for (let wallIndex = 0; wallIndex < allWalls; wallIndex++) {
    let i = 0;
    for (const wall of shuffleWalls) {
      if (i > wallIndex) {
        break;
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
  for (const floorWall of floorWalls) {
    floorWall.draw();
  }
  wallTexture.activate();
  for (const wall of walls) {
    wall.draw();
  }  
  for (const pillar of pillars) {
    pillar.draw();
  }
  await sleep(endWaitInMs);
}
