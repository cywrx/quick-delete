const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const TOKEN = 'TOKEN';
const DELAY = 500; 

client.on('ready', () => {
    console.log(`[LOG] Silent Deleter Active: ${client.user.tag}`);
    console.log(`[LOG] Waiting for trigger: "start [channelId] [message]"`);
});

client.on('messageCreate', async (message) => {

    if (message.author.id !== client.user.id) return;

    if (message.content.startsWith('start')) {
        const args = message.content.split('\n');
        
        if (args.length >= 3) {
            const channelId = args[1].trim();
            const contentToSearch = args[2].trim();

            console.log(`[PROCESS] Target Channel: ${channelId}`);
            console.log(`[PROCESS] Target Text: "${contentToSearch}"`);

            try {
                await message.delete();
            } catch (err) {
                console.error(`[ERROR] Could not delete trigger message: ${err.message}`);
            }

            setTimeout(async () => {
                try {
                    const channel = await client.channels.fetch(channelId);
                    
                    const messages = await channel.messages.fetch({ limit: 10 });
                    const targetMsg = messages.find(m => m.content.includes(contentToSearch) && m.author.id === client.user.id);

                    if (targetMsg) {
                        await targetMsg.delete();
                        console.log(`[SUCCESS] Deleted target message in ${channelId}`);
                    } else {
                        console.log(`[WARN] Target message not found in the last 10 messages.`);
                    }
                } catch (err) {
                    console.error(`[ERROR] Execution failed: ${err.message}`);
                }
            }, DELAY);
        }
    }

    if (message.content === 'stop_script') {
        console.log('[LOG] Shutting down script via remote command.');
        await message.delete();
        process.exit();
    }
});

client.login(TOKEN);
