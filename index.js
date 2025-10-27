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

    // Calculate delay until the start of the next minute
    const now = DateTime.utc().setZone(TIMEZONE);
    const msUntilNextMinute = (60 - now.second) * 1000 - now.millisecond;

    setTimeout(() => {
        updateTimeChannel(); // initial update
        setInterval(updateTimeChannel, 60 * 1000); // every full minute
    }, msUntilNextMinute);
});

async function updateTimeChannel() {
    const now = DateTime.utc().setZone(TIMEZONE);
    const timeString = now.toFormat('hh:mm a'); // e.g., 08:15 AM

    // Only update if the time string has changed
    if (timeString === lastTimeString) return;
    lastTimeString = timeString;

    let guild;
    try {
        guild = await client.guilds.fetch(GUILD_ID);
    } catch {
        return console.log('Guild not found.');
    }

    let channel;
    try {
        channel = await guild.channels.fetch(CHANNEL_ID);
    } catch {
        return console.log('Channel not found.');
    }

    try {
        await channel.setName(`⏱ ${timeString}`);
        console.log(`Updated channel to ${timeString}`);
    } catch (err) {
        console.error('Failed to update channel name:', err);
    }
}

client.login(TOKEN);
