import assert from "assert";
import { readFileSync } from "fs";

const day = 11;

console.log(`day-${day}.js`);

const testInput = `125 17`;
const testAnswer = 55312;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  let stones = {};
  input
    .replaceAll("\r", "")
    .split(" ")
    .forEach((l) => {
      add(stones, Number(l));
    });
  return stones;
}
function add(stones, stone, amount = 1) {
  if (!stones[stone]) stones[stone] = 0;
  stones[stone] += amount;
}

const transformCach = {};
function transform(stone) {
  if (transformCach[stone]) {
    return transformCach[stone];
  }
  let result;
  const string = stone.toString();
  if (stone === 0) {
    result = [1];
  } else if (string.length % 2 === 0) {
    let half = string.length / 2;
    result = [Number(string.slice(0, half)), Number(string.slice(-half))];
  } else {
    result = [Number(stone) * 2024];
  }
  transformCach[stone] = result;
  return result;
}

function blink(stones) {
  let newStones = {};
  for (let stone of Object.keys(stones)) {
    const count = stones[stone];
    const [a, b] = transform(Number(stone));
    add(newStones, a, count);
    if (b || b === 0) add(newStones, b, count);
  }
  return newStones;
}
function countStones(stones) {
  return Object.values(stones).reduce((a, b) => a + b, 0);
}
function blinks(stones, blinks) {
  let result = stones;
  for (let i = 0; i < blinks; i++) {
    result = blink(result);
  }
  return result;
}
function question1(input) {
  let stones = parse(input);
  return countStones(blinks(stones, 25));
}

assert.strictEqual(question1(testInput), testAnswer);

console.log("Answer question 1:", question1(input));

function question2(input) {
  let stones = parse(input);
  return countStones(blinks(stones, 75));
}

console.log("Answer question 2:", question2(input));
