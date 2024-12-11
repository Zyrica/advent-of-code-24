import assert from "assert";
import { readFileSync } from "fs";

const day = 11;

console.log(`day-${day}.js`);

const testInput = `125 17`;
const testAnswer1 = 55312;
const testAnswer2 = null;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  return input.replaceAll("\r", "").split(" ").map(Number);
}

function transform(stone) {
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
  return result;
}
function blink(stones) {
  let newStones = [];
  for (let stone of stones) {
    newStones.push(...transform(stone));
  }
  return newStones;
}
function blinks(stones, blinks) {
  let result = stones;
  for (let i = 0; i < blinks; i++) {
    result = blink(result);
    console.log(i + 1, result.length);
  }
  return result;
}
function question1(input) {
  let stones = parse(input);
  return blinks(stones, 25).length;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  let stones = parse(input);
  return blinks(stones, 75).length;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
