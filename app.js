var restify = require('restify');
var builder = require('botbuilder');
var axios = require('axios');

const BASE_URL = "https://api.coinmarketcap.com/v1/ticker/";

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// This bot ensures user's profile is up to date.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('promptUser');
    },

]);
bot.dialog('promptUser', [
    function (session) {
      builder.Prompts.text(session, "Hi, I'm crypto bot. I can give you information about your favorite cryptocurrency");
    },
    function (session, results) {
      getPrice(results.response, session);
    }
]);


let getPrice = async (currency, session) => {

  let url = BASE_URL + currency;
  try {
    let response = await axios.get(url);
    //console.log(console.log(response.data));
    session.endDialog("Price of " + currency + " is " + response.data[0].price_usd);

  } catch(error) {
    session.endDialog("Sorry there was en error retrieving currency information");
  }
}
