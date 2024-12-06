console.time();
import assert from "assert";
import { readFileSync } from "fs";

const day = 6;

console.log(`day-${day}.js`);

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
const testAnswer1 = 41;
const testAnswer2 = 6;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  const rows = input.split("\n");

  const max = { x: rows[0].length, y: rows.length };
  const grid = {};
  let start = {};
  for (let y = 0; y < max.y; y++) {
    const row = rows[y];
    for (let x = 0; x < max.x; x++) {
      const char = row[x];
      if (char === "^") {
        start = { x, y };
      }
      const key = `${x},${y}`;
      grid[key] = char === "#";
    }
  }
  return { grid, start, max };
}

const turnRight = { up: "right", right: "down", down: "left", left: "up" };
function question1(input) {
  const { grid, start, max } = parse(input);

  let visited = {};
  let direction = "up";
  let { x, y } = start;
  while (x >= 0 && x < max.x && y >= 0 && y < max.y) {
    const key = `${x},${y}`;
    if (!visited[key]) visited[key] = [];
    if (!visited[key].includes(direction)) {
      visited[key].push(direction);
    } else {
      throw new Error("Already visited");
    }
    const next = { x, y };
    switch (direction) {
      case "up":
        next.y--;
        break;
      case "down":
        next.y++;
        break;
      case "left":
        next.x--;
        break;
      case "right":
        next.x++;
        break;
    }
    if (grid[`${next.x},${next.y}`]) {
      direction = turnRight[direction];
    } else {
      x = next.x;
      y = next.y;
    }
  }

  return Object.keys(visited).length;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  const possibleSpots = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] === ".") {
      possibleSpots.push(i);
    }
  }

  let count = 0;
  possibleSpots.forEach((spot) => {
    const newInput = input.slice(0, spot) + "#" + input.slice(spot + 1);
    try {
      question1(newInput);
    } catch (e) {
      count++;
    }
  });
  return count;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
console.timeEnd();
