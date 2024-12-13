import assert from "assert";
import { readFileSync } from "fs";

const day = 13;

console.log(`day-${day}.js`);

const testInput = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;
const testAnswer1 = 480;

const input = readFileSync(`input-day-13.txt`, "utf-8");

function parse(input) {
  return input
    .replaceAll("\r", "")
    .split("\n\n")
    .map((s) => {
      let [a, b, prize] = s.split("\n");
      [a, b] = [a, b].map((s) => {
        const [x, y] = s.split(", ").map((s) => Number(s.split("+")[1]));
        return { x, y };
      });
      const [x, y] = prize.split(", ").map((s) => Number(s.split("=")[1]));
      return { a, b, prize: { x, y } };
    });
}

function findCheapest({ a, b, prize }) {
  const bCount = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
  if (bCount < 0 || !Number.isInteger(bCount)) return 0;

  const aCount = (prize.x - b.x * bCount) / a.x;
  if (aCount < 0 || !Number.isInteger(aCount)) return 0;

  return 3 * aCount + bCount;
}

function question1(input) {
  const claws = parse(input);

  const cheapest = claws.map(findCheapest);
  return cheapest.reduce((a, b) => a + b, 0);
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function parse2(input) {
  const claws = parse(input);
  claws.forEach((claw) => {
    claw.prize.x += 10000000000000;
    claw.prize.y += 10000000000000;
  });
  return claws;
}

function question2(input) {
  const claws = parse2(input);

  const cheapest = claws.map(findCheapest);
  return cheapest.reduce((a, b) => a + b, 0);
}

console.log("Answer question 2:", question2(input));
