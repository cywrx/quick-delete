const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const TOKEN = 'YOUR_DISCORD_TOKEN_HERE';
const DELAY = 500; 

let targetChannelId = null;
let targetContent = null;
let isListening = false;

client.on('ready', () => {
    console.log(`[SYSTEM] logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== client.user.id) return;


    if (message.content.startsWith('start')) {
        const lines = message.content.split('\n');
        if (lines.length >= 3) {
            targetChannelId = lines[1].trim();
            targetContent = lines[2].trim(); 
            isListening = true;
            console.log(`[ACTIVE] Watching #${targetChannelId} for exactly: "${targetContent}"`);
        }
        return;
    }

    if (message.content.trim() === 'stop') {
        console.log('[SYSTEM] Stopping script...');
        process.exit();
    }

    
    if (isListening && message.channel.id === targetChannelId) {
        
        if (message.content === targetContent) {
            console.log(`[MATCH] Found "${message.content}". Deleting in ${DELAY}ms...`);
            
            setTimeout(async () => {
                try {
                    await message.delete();
                    console.log(`[SUCCESS] Deleted.`);
                    
                } catch (err) {
                    console.error(`[ERROR] ${err.message}`);
                }
            }, DELAY);
        }
    }
});

client.login(TOKEN);

