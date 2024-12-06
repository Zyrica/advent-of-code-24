import assert from "assert";
import { readFileSync } from "fs";

const day = -1;

console.log(`day-${day}.js`);

const testInput = ``;
const testAnswer1 = null;
const testAnswer2 = null;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  return input.replaceAll("\r", "").split("\n");
}

function question1(input) {
  return parse(input);
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  return parse(input);
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
