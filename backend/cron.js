const cron = require("node-cron");

//cron.schedule('*/5 * * * *', async () => {

cron.schedule("* * * * *", async () => {
  console.log("[CRON] Szinkron indul...");
  console.log("[CRON] siker");
});
