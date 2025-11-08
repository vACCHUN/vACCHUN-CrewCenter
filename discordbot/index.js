import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import pool from "./config/mysql.js";
import { formatDate } from "./utils.js";

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function sendEventNotifications(client) {
  const eventsChannel = await client.channels.fetch(process.env.EVENTS_CHANNEL_ID);
  const roleId = process.env.ROLE_ID;

  const [rows] = await pool.query(`
    SELECT *
    FROM events
    WHERE is_notification_sent = 0
      AND start_time >= CURRENT_DATE + INTERVAL 1 DAY
      AND start_time <  CURRENT_DATE + INTERVAL 2 DAY
  `);

  for (const event of rows) {
    const embed = {
      title: `EVENT - ${event.name}`,
      description: `**${formatDate(event.start_time)} - ${formatDate(event.end_time)}**\n\n${event.description}`,
      color: 26303,
      timestamp: new Date().toISOString(),
      footer: { text: "EVENT NOTIFICATION" },
      author: {
        name: "vACCHUN EVENTS",
        url: "https://vacchun.hu/",
        icon_url: "https://vacchun.hu/img/logo.png",
      },
    };

    try {
      const msg = await eventsChannel.send({
        content: "<@&" + roleId + ">",
        embeds: [embed],
      });

      await pool.query(`UPDATE events SET is_notification_sent = 1 WHERE id = ?`, [event.id]);
    } catch (err) {
      console.error(`❌ Failed to send event ${event.id}`, err);
    }
  }
}

client.on(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  const interval = parseInt(process.env.REFRESH_INTERVAL, 10);

  await sendEventNotifications(client);

  setInterval(() => sendEventNotifications(client), interval);

});

client.login(process.env.TOKEN);
