import assert from "assert";
import { readFileSync } from "fs";

console.log("day-2.js");

const testInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
const testAnswer1 = 2;
const testAnswer2 = 4;

const input = readFileSync("input-day-2.txt", "utf-8");

function parse(input) {
  return input.split("\n").map((s) => s.split(" ").map(Number));
}

function isSafeReport(report) {
  const first = report[0];
  const last = report[report.length - 1];
  if (first === last) return false;
  const asc = first < last;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    if (Math.abs(diff) > 3 || !diff) return false;
    if ((asc && diff > 0) || (!asc && diff < 0)) return false;
  }
  return true;
}

function question1(input) {
  const reports = parse(input);

  return reports.filter(isSafeReport).length;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function findFirstError(report) {
  const first = report[0];
  const last = report[report.length - 1];
  if (first === last) return 0;
  const asc = first < last;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i] - report[i + 1];
    if (Math.abs(diff) > 3 || !diff) return i;
    if ((asc && diff > 0) || (!asc && diff < 0)) return i;
  }
}

function question2(input) {
  const reports = parse(input);
  const safeReports = reports.filter((report) => {
    if (isSafeReport(report)) return true;

    const i = findFirstError(report);

    const r1 = [...report];
    r1.splice(i, 1);
    const r2 = [...report];
    r2.splice(i + 1, 1);

    return isSafeReport(r1) || isSafeReport(r2);
  });
  return safeReports.length;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Anser question 2:", question2(input));
