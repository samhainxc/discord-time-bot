require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DateTime } = require('luxon');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const TIMEZONE = 'America/Chicago';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let lastTimeString = '';

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    scheduleNextUpdate(); // Start the update cycle
});

async function scheduleNextUpdate() {
    await updateTimeChannel(); // Do the update now

    // Calculate how long until the next full minute
    const now = DateTime.utc().setZone(TIMEZONE);
    const msUntilNextMinute = (60 - now.second) * 1000 - now.millisecond;

    setTimeout(scheduleNextUpdate, msUntilNextMinute);
}

async function updateTimeChannel() {
    const now = DateTime.utc().setZone(TIMEZONE);
    const timeString = now.toFormat('hh:mm a');

    if (timeString === lastTimeString) return; // No need to update
    lastTimeString = timeString;

    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(CHANNEL_ID);
        await channel.setName(`⏱ ${timeString}`);
        console.log(`Updated channel to ${timeString}`);
    } catch (err) {
        console.error('Failed to update channel name:', err);
    }
}

client.login(TOKEN);
