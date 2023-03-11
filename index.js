module.exports = require('./client')
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();
const { Client, Intents, Events, GatewayIntentBits} = require('discord.js');
const { Message } = require('node_characterai/message');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.once(Events.ClientReady, (clientUser) => {
    console.log(`Logged in as ${clientUser.user.tag}`)
})

client.login(''); // <= Connect TOKEN your Bot Discord
// client.login(process.env.BOT_TOKEN)

const userMap = new Map();

//reponse and display in terminal
    
    client.on(Events.MessageCreate, async (message) => {
        // Check if the message was sent by a bot or if the message has no content
        if (message.author.bot || !message.content) return;
        const username = message.author.username;
        const userId = message.author.id;
      

        if (!userMap.has(userId)) {
            const user = {
              name: message.author.username,
              chatId: '', // add an attribute to store the chat ID of the user with the bot
            };
            userMap.set(userId, user);
          }

        try {
            // Get the user ID
            const user = userMap.get(userId);

            if (!user.chatId) {
                const chat = await characterAI.createChat(); // Create a new chat ID
                user.chatId = chat.chatId; // Store chat ID in Map
              }

          // Create a chat instance for the Discord moderator
          const chat = await characterAI.createOrContinueChat(""); // <= Enter your CharacterID
      
          // Send the message to the chat instance and await the response
          message.channel.sendTyping();
          const response = await chat.sendAndAwaitResponse(message.content, true);
      
          // Send the response back to the Discord channel
          const channel = message.channel;
          await channel.send(response.text);
      
          // Log the messages to the console
          console.log(`[${message.author.tag}] ${message.content}`);
          console.log(`[Bot] ${response.text}`);
        } catch (error) {
          console.error(error);
        }
      });
    
    
//```````````
    
(async() => {
    await characterAI.authenticateWithToken(""); // <= Enter Your Token
    // await characterAI.authenticateAsGuest();  // <= Login as Guest

    const characterId = "" // Discord moderator

    

    const chat = await characterAI.createOrContinueChat(characterId);
    const response = await chat.sendAndAwaitResponse('Hello discord mod!', true)
   
    console.log(response);
    // use response.text to use it in a string.

})();


