const Article = require("../models/event-model");

function add(message) {
  article = new Article();
  (article.eventId = message.client_msg_id),
    (article.slackID = message.user),
    (article.endDate = Date.now()),
    (article.message = message.text);

  // article.find(message.user);
  article.save(function(err) {
    if (err) {
      console.log("error", err);
    } else {
      return "success";
    }
  });
}

module.exports = add;
