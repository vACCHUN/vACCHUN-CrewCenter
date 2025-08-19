const axios = require("axios");
require("dotenv").config();
const APIKEY = process.env.CORE_API;
const INACTIVITY_WEBHOOK = process.env.INACTIVITY_WEBHOOK;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInactive() {
  const members = await getControllers();
  const statusMessageId = await sendInitMessage();
  console.log(statusMessageId);

  const reqPerMinute = 10;
  const delay = 60000 / reqPerMinute;

  let count = 1;
  for (const memberId of members) {
    console.log(`${count}/${members.length} | Delay: ${delay / 1000}s`);
    updateStatus(statusMessageId, count, members.length);
    const { hoursFive, hoursSix } = await checkMember(memberId);

    if (hoursFive < 5) {
      messageInactive(memberId, hoursFive, hoursSix);
    }
    await sleep(delay);
    count++;
  }
}

function updateStatus(msgId, curr, total) {
  const progressBar = createProgressBar(curr, total, 20); // 20 karakteres progress bar
  axios
    .patch(`${INACTIVITY_WEBHOOK}/messages/${msgId}`, constructEmbed("Inactivity Warning - Állapot", `${curr}/${total} ellenőrizve\n${progressBar}`))
    .then()
    .catch(console.error);
}

function createProgressBar(curr, total, length) {
  const filledLength = Math.round((curr / total) * length);
  const emptyLength = length - filledLength;
  const filled = "█".repeat(filledLength);
  const empty = "░".repeat(emptyLength);
  return `[${filled}${empty}] ${Math.round((curr / total) * 100)}%`;
}

function constructEmbed(title, description, hoursSix = 0) {
  return {
    content: "",
    tts: false,
    embeds: [
      {
        title: title,
        description: description,
        color: hoursSix < 5 ? 15614294 : 16735232,
        fields: [],
        timestamp: new Date(),
      },
    ],
    components: [],
    actions: {},
    flags: 0,
    username: "Inactivity Warning",
  };
}

async function sendInitMessage() {
  try {
    const res = await axios.post(`${INACTIVITY_WEBHOOK}?wait=true`, constructEmbed("Inactivity Warning - Állapot", `0/0 ellenőrizve`));
    return res.data.id;
  } catch (err) {
    console.error("Webhook error:", err.response ? err.response.data : err.message);
  }
}

async function messageInactive(memberId, hoursFive, hoursSix) {
  const name = await getName(memberId);
  const message = `${name}-nak (${memberId}) az elmúlt 5 hónapban irányított ideje: ${hoursFive.toFixed(2)} óra, az elmúlt 6 hónapban pedig ${hoursSix.toFixed(2)}`;
  console.log(message);

  try {
    await axios.post(INACTIVITY_WEBHOOK, constructEmbed(`Inactivity Warning - ${name}`, message, hoursSix));
  } catch (err) {
    console.error("Webhook error:", err.response ? err.response.data : err.message);
  }
}

async function getName(memberId) {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://core.vateud.net/api/facility/user/${memberId}`,
      headers: {
        Accept: "application/json",
        "X-API-Key": APIKEY,
      },
    };

    const response = await axios(config);
    const data = response.data.data;

    if (data && data.first_name && data.last_name) {
      return `${data.first_name} ${data.last_name}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching member ${memberId}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

async function getControllers() {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://core.vateud.net/api/facility/roster",
      headers: {
        Accept: "application/json",
        "X-API-Key": APIKEY,
      },
    };

    const response = await axios(config);
    return response.data.data.controllers;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function checkMember(memberId) {
  const sessions = await getAtcSessions(memberId);
  if (!sessions) return false;

  const now = new Date();
  const fiveMonthsAgo = new Date();
  const sixMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  let totalSecondsFive = 0;
  let totalSecondsSix = 0;

  for (const s of sessions) {
    const start = new Date(s.connection_id.start);
    const end = new Date(s.connection_id.end);
    const callsign = s.connection_id.callsign;
    const validPrefix = callsign.startsWith("LHBP_") || callsign.startsWith("LHCC_");

    if (end >= fiveMonthsAgo && validPrefix) {
      totalSecondsFive += (end - start) / 1000;
    }
    if (end >= sixMonthsAgo && validPrefix) {
      totalSecondsSix += (end - start) / 1000;
    }
  }

  const totalHoursFive = totalSecondsFive / 3600;
  const totalHoursSix = totalSecondsSix / 3600;
  // console.log(`Member ${memberId} total 5mo: ${totalHours.toFixed(2)}h`);
  return { hoursFive: totalHoursFive, hoursSix: totalHoursSix };
}

async function getAtcSessions(memberId) {
  try {
    const res = await axios.get(`https://api.vatsim.net/v2/members/${memberId}/atc`);
    return res.data.items;
  } catch (err) {
    console.error(`API error for member ${memberId}:`, err.response ? err.response.data : err.message);
  }
}

module.exports = { getInactive };
