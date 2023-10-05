import cron from "node-cron";
import { checkData, checkApi } from "./check.js";
import { crosscheckData } from "./crosscheck.js";
import { sendWA } from "./send.js";

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
  // Jam 00 UTC
  cron.schedule("15 0 * * *", async () => {
    run("00");
  });
  // Jam 01 UTC
  cron.schedule("15 1 * * *", async () => {
    run("00");
  });
  // Jam 02 UTC
  cron.schedule("15 2 * * *", async () => {
    run("00");
  });
  // Jam 03 UTC
  cron.schedule("15 3 * * *", async () => {
    run("00");
  });
  // Jam 06 UTC
  cron.schedule("15 6 * * *", async () => {
    run("00");
  });
  // Jam 09 UTC
  cron.schedule("15 9 * * *", async () => {
    run("00");
  });
  // Jam 12 UTC
  cron.schedule("15 12 * * *", async () => {
    run("00");
  });
  // Jam 15 UTC
  cron.schedule("15 15 * * *", async () => {
    run("00");
  });
  // Jam 18 UTC
  cron.schedule("15 18 * * *", async () => {
    run("00");
  });
  // Jam 21 UTC
  cron.schedule("15 21 * * *", async () => {
    run("00");
  });
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
