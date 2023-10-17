import cron from "node-cron";
import { checkData, checkApi } from "./check.js";
import { crosscheckData } from "./crosscheck.js";
import { sendWA } from "./send.js";
import env from "dotenv";
env.config();

let targetNumber = process.env.TARGET_NUMBER;
targetNumber = targetNumber.split(",");

const numberAviation = "120363043457245549";

const hours = [0, 3, 6, 9, 12, 15, 18, 21];
const aviation = [0, 3, 6, 9, 12, 15, 18, 21];

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  for (const hour of hours) {
    const scheduleTime = `25 ${hour} * * *`;
    cron.schedule(scheduleTime, async () => {
      console.log(`Running cron job at ${hour} UTC`);

      for (let number of targetNumber) {
        if (number == numberAviation) {
          if (aviation.includes(hour)) {
            console.log("Running aviation");
            run("00", number);
          }
        } else {
          console.log("Running DIP");
          run("00", number);
        }
      }
    });
  }
} else {
  console.log("Running in development mode");
  run("00", targetNumber[0]);
}

const stasiun = checkData();

async function run(menit, number) {
  try {
    const data = await checkApi(menit);
    let result = [];
    for (let i = 0; i < stasiun.length; i++) {
      const crosscheck = crosscheckData(data, stasiun[i]["icaoId"]);
      if (crosscheck == undefined) {
        result.push([stasiun[i]["icaoId"], stasiun[i]["name"]]);
      }
    }
    sendWA(result, menit, number);
  } catch (error) {
    // Handle any errors that occur during the execution of checkApi() or run() here.
    console.error("Error in run():", error);
  }
}
