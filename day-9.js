import assert from "assert";
import { readFileSync } from "fs";

const day = 9;

console.log(`day-${day}.js`);

const testInput = `2333133121414131402`;
const testAnswer1 = 1928;
const testAnswer2 = 2858;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  input = input.replaceAll("\r", "");
  const fileString = [];
  const files = [];
  for (let id = 0; id < Math.ceil(input.length / 2); id++) {
    const value = input[id * 2];
    files.push({
      id,
      size: Number(value),
      index: fileString.length,
    });

    for (let i = 0; i < value; i++) {
      fileString.push(id);
    }

    const empty = input[id * 2 + 1];
    for (let i = 0; i < empty; i++) {
      fileString.push(".");
    }
  }
  return { fileString, files };
}

function format(fileString) {
  while (fileString.filter((x) => x === ".").length > 0) {
    let index = fileString.indexOf(".");
    let v = ".";
    while (v === ".") {
      v = fileString.pop();
    }
    fileString.splice(index, 1, v);
  }
  return fileString;
}
function checkSum(fileString) {
  let sum = 0;
  for (let i = 0; i < fileString.length; i++) {
    const v = fileString[i];
    if (v !== ".") sum += v * i;
  }
  return sum;
}
function question1(input) {
  const { fileString } = parse(input);
  const formatted = format(fileString);
  return checkSum(formatted);
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function findEmptySpaceBeforeIndex(fileString, size, index) {
  let emptySpace;
  let emptyCount = 0;
  for (let i = 0; i < index; i++) {
    if (fileString[i] === ".") {
      if (emptyCount === 0) {
        emptySpace = i;
      }
      emptyCount++;
      if (emptyCount === size) {
        return emptySpace;
      }
    } else {
      emptyCount = 0;
    }
  }
}

function wholeFileFormat(fileString, files) {
  const filesToCheck = [...files];
  while (filesToCheck.length > 0) {
    const { id, size, index } = filesToCheck.pop();

    const emptySpace = findEmptySpaceBeforeIndex(fileString, size, index);

    if (emptySpace) {
      for (let i = 0; i < size; i++) {
        fileString[emptySpace + i] = id;
        fileString[index + i] = ".";
      }
    }
  }
  return fileString;
}

function question2(input) {
  const { fileString, files } = parse(input);
  const formatted = wholeFileFormat(fileString, files);
  return checkSum(formatted);
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));

// 8570102309998 to high
// 6567942076771 to high
