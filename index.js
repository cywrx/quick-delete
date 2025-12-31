const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const TOKEN = 'YOUR_DISCORD_TOKEN_HERE';
const DELAY = 500; // 0.5 seconds <<<<< edit this if as u wish.

let targetChannelId = null;
let isListening = false;

client.on('ready', () => {
    console.log(`[SYSTEM] logged in as ${client.user.tag}`);
    console.log(`[IDLE] Waiting for "start" command in Discord...`);
});

client.on('messageCreate', async (message) => {

    if (message.author.id === client.user.id && message.content.startsWith('start')) {
        const lines = message.content.split('\n');
        if (lines.length >= 2) {
            targetChannelId = lines[1].trim();
            isListening = true;
            console.log(`[ACTIVE] Now watching channel: ${targetChannelId}`);
        }
        return;
    }

    if (message.author.id === client.user.id && message.content.trim() === 'stop') {
        console.log('[SYSTEM] Stopping script...');
        process.exit();
    }

    if (isListening && message.channel.id === targetChannelId && message.author.id === client.user.id) {
        
        if (message.content.startsWith('start')) return;

        console.log(`[DETECTED] Message found: "${message.content}"`);
        
        setTimeout(async () => {
            try {
                await message.delete();
                console.log(`[SUCCESS] Message deleted after ${DELAY}ms.`);

                console.log(`[IDLE] Task finished. Send "start" again for a new task.`);
            } catch (err) {
                console.error(`[ERROR] Delete failed: ${err.message}`);
            }
        }, DELAY);
    }
});

client.login(TOKEN);

