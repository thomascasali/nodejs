const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'TELEGRAM-TOKEN';


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/coord (?:0*(?:\.\d+)?|1(\.0*)?)([ ,])(?:0*(?:\.\d+)?|1(\.0*)?)/, function(msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    console.log(match);
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    console.log("coordinate ricevute: " + match[1] + ", " + match[2] );
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });
  
  bot.onText(/\/echo (.+)/, function(msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    const chatId = msg.chat.id;
    const resp = "mi hai mandato il testo: " + match[1]; // the captured "whatever"
    console.log("hai ricevuto il messaggio: " + match[1]);
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });
  // Listen for any kind of message. There are different kinds of
  // messages.
  /****** commentato per evitare di ricevere messaggi non di testo
  bot.on('message', function(msg) {
    const chatId = msg.chat.id;
    console.log(msg);
    // send a message to the chat acknowledging receipt of their message
    
    bot.sendMessage(chatId, 'Ciao ' + msg.from.first_name + ' ho ricevuto il tuo messaggio!');
  });
  *******/
