require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DateTime } = require('luxon');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const TIMEZONE = 'America/Chicago';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

let lastTimeString = '';

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Immediate update on startup
    updateTimeChannel();

    // Schedule the next update at the start of the next minute
    scheduleNextMinuteUpdate();
});

function scheduleNextMinuteUpdate() {
    const now = DateTime.utc().setZone(TIMEZONE);
    const msUntilNextMinute = (60 - now.second) * 1000 - now.millisecond;

    setTimeout(() => {
        updateTimeChannel();
        setInterval(updateTimeChannel, 60 * 1000); // every full minute
    }, msUntilNextMinute);
}

async function updateTimeChannel() {
    const now = DateTime.utc().setZone(TIMEZONE);
    const timeString = now.toFormat('hh:mm a');

    // Only update if the time string has changed
    if (timeString === lastTimeString) return;
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
