import cron from "node-cron";
import { checkData, checkApi } from "./check.js";
import { crosscheckData } from "./crosscheck.js";
import { sendWA } from "./send.js";

const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 18, 21];

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  for (const hour of hours) {
    const scheduleTime = `15 ${hour} * * *`;
    cron.schedule(scheduleTime, async () => {
      run("00");
    });
  }
} else {
  console.log("Running in development mode");
  run("00");
}

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
