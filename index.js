const moment = require("moment");
const simpleGit = require("simple-git")();
const fs = require("fs");

const FILE_PATH = "./date.txt";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

async function makeCommit(n) {
  if (n === 0) {
    return;
  }

  const x = getRandomInt(0, 40);
  const y = getRandomInt(0, 6);

  const DATE = moment().subtract(1, "y").add(x, "w").add(y, "d").format();

  fs.writeFileSync(FILE_PATH, DATE);
  process.env.GIT_COMMITTER_DATE = DATE;
  process.env.GIT_AUTHOR_DATE = DATE;

  await simpleGit.add([FILE_PATH]).commit(DATE, FILE_PATH);

  await makeCommit(n - 1);
}

makeCommit(10);
