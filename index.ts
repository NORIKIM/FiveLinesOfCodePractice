
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface Input2 {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
}

class Right implements Input2 {
  isRight(): boolean {
    return true;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
}

class Left implements Input2 {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return true;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return false;
  }
}

class Up implements Input2 {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return true;
  }
  isDown(): boolean {
    return false;
  }
}

class Down implements Input2 {
  isRight(): boolean {
    return false;
  }
  isLeft(): boolean {
    return false;
  }
  isUp(): boolean {
    return false;
  }
  isDown(): boolean {
    return true;
  }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile2[][];
let inputs: Input2[] = [];

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function update() {
  handleInputs();
  updateMap();
}

function handleInputs() {
  while (inputs.length > 0) {
    let current = inputs.pop();
    handleInput(current);
  }
}

function handleInput(input: Input2) {
  if (input.isLeft())
    moveHorizontal(-1);
  else if (input.isRight())
    moveHorizontal(1);
  else if (input.isDown())
    moveVertical(1);
  else if (input.isUp())
    moveVertical(-1);
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function updateTile(x: number, y: number) {
  if ((map[y][x].isStone() || map[y][x].isFallingStone())
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingStone();
    map[y][x] = new Air();
  } else if ((map[y][x].isBox() || map[y][x].isFallingBox())
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingBox();
    map[y][x] = new Air();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone();
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

interface Tile2 {
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isKey1(): boolean;
  isKey2(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  isAir(): boolean;
  isPlayer(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
}

class Flux implements Tile2 {
  isFlux(): boolean {
    return true;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
}

class Unbreakable implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return true;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

class Stone implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return true;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number): void {
    
  }
}

class FallingStone implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return true;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

class Box implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return true;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
      moveToTile(playerx + dx, playery);
    }
  }
  moveVertical(dy: number): void {
    
  }
}

class FallingBox implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return true;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

class Key1 implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return true;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
}

class Key2 implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return true;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}

class Lock1 implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return true;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

class Lock2 implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return true;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

class Air implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return true;
  }
  isPlayer(): boolean {
    return false;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    
  }
  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
}

class Player implements Tile2 {
  isFlux(): boolean {
    return false;
  }
  isUnbreakable(): boolean {
    return false;
  }
  isStone(): boolean {
    return false;
  }
  isFallingStone(): boolean {
    return false;
  }
  isBox(): boolean {
    return false;
  }
  isFallingBox(): boolean {
    return false;
  }
  isKey1(): boolean {
    return false;
  }
  isKey2(): boolean {
    return false;
  }
  isLock1(): boolean {
    return false;
  }
  isLock2(): boolean {
    return false;
  }
  isAir(): boolean {
    return false;
  }
  isPlayer(): boolean {
    return true;
  }
  draw(g: CanvasRenderingContext2D, x: number, y: number): void {
    
  }
  moveHorizontal(dx: number): void {
    
  }
  moveVertical(dy: number): void {
    
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap.length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.PLAYER: return new Player();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.STONE: return new Stone();
    case RawTile.FALLING_STONE: return new FallingStone();
    case RawTile.BOX: return new Box();
    case RawTile.FALLING_BOX: return new FallingBox();
    case RawTile.FLUX: return new Flux();
    case RawTile.KEY1: return new Key1();
    case RawTile.KEY2: return new Key2();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.LOCK2: return new Lock2();
    default: assertExhausted(tile);
  }
}

function assertExhausted(x: never): never {
  throw new Error("없어 왜냐면: " + x);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

