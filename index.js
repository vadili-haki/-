const moment = require("moment");
const simpleGit = require("simple-git")();
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "date.txt");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // Returns a random integer between min (inclusive) and max (exclusive)
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Creates a specified number of commits with backdated timestamps.
 * @param {number} n - The number of commits to create.
 * @param {number} [year] - The optional year to generate commits for. If not provided, generates commits for the past year.
 */
async function makeCommits(n, year) {
  if (n <= 0) {
    console.log("No commits to make.");
    return;
  }

  console.log(
    `Attempting to create ${n} commits${year ? ` for the year ${year}` : ""}...`
  );

  try {
    for (let i = 0; i < n; i++) {
      let DATE;

      if (year) {
        // If a year is specified, create a random date within that year.
        const maxDays = moment([year]).isLeapYear() ? 366 : 365;
        const dayOfYear = getRandomInt(1, maxDays + 1);
        DATE = moment().year(year).dayOfYear(dayOfYear).format();
      } else {
        // Original behavior: a random date in the last year or so.
        const weeks = getRandomInt(0, 56);
        const days = getRandomInt(0, 7); // 0-6 days
        DATE = moment()
          .subtract(1, "y")
          .add(weeks, "w")
          .add(days, "d")
          .format();
      }

      fs.writeFileSync(FILE_PATH, DATE);

      // Add the file and commit with a specific author date.
      await simpleGit.add(FILE_PATH).commit(DATE, { "--date": DATE });
    }
    console.log(
      `Successfully created ${n} commits${year ? ` for ${year}` : ""}.`
    );
  } catch (err) {
    console.error("An error occurred while creating commits:", err);
  }
}

// --- EXAMPLES ---
// To create 176 commits for the year 2020:
// makeCommits(176, 2020);

// To create 176 commits over the last year (original behavior):
makeCommits(180, 2024);
