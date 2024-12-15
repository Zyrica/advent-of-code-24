import assert from "assert";
import { readFileSync } from "fs";

const day = 15;

console.log(`day-${day}.js`);

const testInput = [
  `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<`,
  `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
  `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`,
];
const testAnswer = [2028, 10092, 9021];

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  let [gridString, moves] = input.replaceAll("\r", "").split("\n\n");
  const pos = {};
  const rows = gridString.split("\n");
  const grid = {
    height: rows.length,
    get: ({ x, y }) => {
      return grid[`${x},${y}`];
    },
    set: ({ x, y }, v) => {
      grid[`${x},${y}`] = v;
    },
  };
  rows.map((row, y) => {
    grid.width = row.length;
    row.split("").map((v, x) => {
      let key = `${x},${y}`;
      if (v === "@") {
        pos.x = x;
        pos.y = y;
        v = ".";
      }
      grid[key] = v;
    });
  });
  return { grid, moves, pos };
}

function print(grid, pos) {
  let str = "";
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (pos.x === x && pos.y === y) {
        str += "@";
        continue;
      }
      str += grid[`${x},${y}`];
    }
    str += "\n";
  }
  console.log(str);
}

function next(pos, move) {
  const next = { ...pos };
  switch (move) {
    case "^":
      next.y--;
      break;
    case "v":
      next.y++;
      break;
    case "<":
      next.x--;
      break;
    case ">":
      next.x++;
      break;
  }
  return next;
}
function push(grid, move, pos) {
  const n = next(pos, move);
  const nv = grid.get(n);
  if (nv === ".") {
    grid.set(n, "O");
    return true;
  } else if (nv === "#") {
    return false;
  } else if (nv === "O") {
    if (push(grid, move, n)) {
      grid.set(n, "O");
      return true;
    } else {
      return false;
    }
  }
}
function pushBig(grid, move, pos) {
  const searchedTiles = {};

  let tilesToSearch = [
    pos,
    {
      x: pos.x + (grid.get(pos) === "[" ? 1 : -1),
      y: pos.y,
    },
  ];
  while (tilesToSearch.length) {
    const { x, y } = tilesToSearch.shift();
    const key = `${x},${y}`;
    if (searchedTiles[key]) {
      continue;
    }
    const v = grid.get({ x, y });
    searchedTiles[key] = { x, y, v };
    if (v === "#") {
      return false;
    } else if (v === "[" || v === "]") {
      const n1 = next({ x, y }, move);
      const n2 = { x: x + (v === "[" ? 1 : -1), y };

      tilesToSearch.push(n1);
      tilesToSearch.push(n2);
    }
  }

  Object.values(searchedTiles).forEach(({ x, y }) => {
    grid.set({ x, y }, ".");
  });
  Object.values(searchedTiles).forEach(({ x, y, v }) => {
    if (v === ".") return;
    const n = next({ x, y }, move);
    grid.set(n, v);
  });
  return true;
}
function move(grid, pos, move) {
  const n = next(pos, move);
  const nv = grid.get(n);
  if (nv === ".") {
    pos.x = n.x;
    pos.y = n.y;
  } else if (nv === "#") {
    // do nothing
  } else if (nv === "O") {
    if (push(grid, move, n)) {
      pos.x = n.x;
      pos.y = n.y;
      grid.set(n, ".");
    }
  } else if (nv === "[" || nv === "]") {
    if (pushBig(grid, move, n)) {
      pos.x = n.x;
      pos.y = n.y;
      grid.set(n, ".");
    }
  }
}

function getSum(grid) {
  let sum = 0;
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.get({ x, y }) === "O" || grid.get({ x, y }) === "[") {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
}
function question1(input) {
  const { grid, moves, pos } = parse(input);
  for (let m of moves) {
    move(grid, pos, m);
  }
  return getSum(grid);
}

assert.strictEqual(question1(testInput[0]), testAnswer[0]);
assert.strictEqual(question1(testInput[1]), testAnswer[1]);

console.log("Answer question 1:", question1(input));

function parse2(input) {
  let s = input
    .replaceAll("#", "##")
    .replaceAll("O", "[]")
    .replaceAll(".", "..")
    .replace("@", "@.");
  const { grid, moves, pos } = parse(s);

  return { grid, moves, pos };
}

function question2(input) {
  const { grid, moves, pos } = parse2(input);
  for (let m of moves) {
    move(grid, pos, m);
  }
  return getSum(grid);
}
assert.strictEqual(question2(testInput[1]), testAnswer[2]);

console.log("Answer question 2:", question2(input));
