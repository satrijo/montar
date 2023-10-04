import cron from "node-cron";
import { checkData, checkApi } from "./check.js";
import { crosscheckData } from "./crosscheck.js";
import { sendWA } from "./send.js";

// Run every at minute 40 every hour
// cron.schedule("40 * * * *", async () => {
//   run("30");
// });

// Run every at minute 10 every hour
cron.schedule("10 * * * *", async () => {
  run("00");
});

const date = new Date();
console.log("Running a task every minute 10" + date);

const stasiun = checkData();

async function run(jam) {
  try {
    const data = await checkApi(jam);
    let result = [];
    for (let i = 0; i < stasiun.length; i++) {
      const crosscheck = crosscheckData(data, stasiun[i]["icaoId"]);
      if (crosscheck == undefined) {
        result.push([stasiun[i]["icaoId"], stasiun[i]["name"]]);
      }
    }
    sendWA(result, jam);
  } catch (error) {
    // Handle any errors that occur during the execution of checkApi() or run() here.
    console.error("Error in run():", error);
  }
}

run("00");
