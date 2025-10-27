require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { DateTime } = require('luxon');

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const TIMEZONE = 'America/Chicago';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    updateTimeChannel();
    setInterval(updateTimeChannel, 10 * 1000); // every 10 seconds
});

async function updateTimeChannel() {
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

    const now = DateTime.now().setZone(TIMEZONE);
    const timeString = now.toFormat('hh:mm a'); // e.g., 07:00 AM

    try {
        await channel.setName(`⏱ ${timeString}`);
        console.log(`Updated channel to ${timeString}`);
    } catch (err) {
        console.error('Failed to update channel name:', err);
    }
}

client.login(TOKEN);