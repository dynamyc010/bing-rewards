export default async function sendInvalidTokenWebhook() {
    const url = String(process.env.DISCORD_URL);
    if(!url || !url.includes("discord.com")) {
        // First part technically shouldn't happen, but... never hurts!
        return console.log("URL not set or is not a Discord URL; aborting...");
    }
    // I hope this avatar URL is static lmao
    const webhookParams = {
        username: 'Bing Rewards',
        avatar_url: 'https://az15297.vo.msecnd.net/images/rewards/membercenter/missions/Ms_Logo_48px.png',
        content: process.env.DISCORD_ID ? `<@${process.env.DISCORD_ID}>` : "",
        embeds: [
            {
                "title": "Bing Rewards token invalidated!",
                "color": 2640774,
                "description": "You should log in again."
            }
        ]
    }

    try{
        import('node-fetch').then(({default: fetch}) => fetch(url,{
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(webhookParams)
        }));
    }
    catch(e){
        if(e instanceof Error) console.error(`Failed to send embed: ${e.message}`);
        return;
    }
}