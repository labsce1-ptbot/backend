const NodeCron = require("../../config/node-con");
// const botkitRouter = require("../../routers/botkitRouter");
<<<<<<< HEAD
const bodyParser = require('body-parser');
const User = require('../../models/user-model')
const Event = require('../../models/event-model')

=======
const bodyParser = require("body-parser");
const User = require("../../models/user-model");
>>>>>>> 991c44a541b7a9b1ecdddf62fc2222c8f51ddaca

module.exports = function(botkit) {
  // NodeCron();
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "UserRoutes.js",

    init: function(controller) {
      // add a web route
      controller.webserver.get("/profile", async (req, res) => {
        // console.log("he", res);
        let user;
        if (req.isAuthenticated()) {
          try {
            user = req.user;
            // console.log("<-=-=-=-=- req.user =-=-=-=-=->\n", req);
            console.log("<-=-=-=-=- Success! =-=-=-=->\n");
            return res.status(200).json({ success: true, userInfo: user });
          } catch (err) {
            return res.status(500).json({ success: false });
          }
        }
        return res.status(500).json({ success: false });
        // res.status(200).json({ success: true, userInfo: user });
      });

      // Find User for Populate Endpoint change to events in future
      controller.webserver.get("/info", async (req, res) => {
        console.log("|--- Slack-info Endpoint---|\n", req.user);
        const findUser = await User.findOne({
          email: req.user[0].email
        })
          .populate('slack')
          .exec(async (err, info) => {
            console.log('Slack Info:\n', info);
            console.log('|---Access---|\n', info.slack[0].team_id)
            
            const findEvent = await Event.find({
              teamID: info.slack[0].team_id,
              slackID: info.slack[0].slackId,
            }).populate('message').exec((err, event) => {
              console.log("|---Event Info---|\n", event)
              res.send(event)
            })
          });

      });

      // controller.webserver.get("/users", (req, res) => {
      //   users.find({}, (err, users) => {
      //     res.send(users);
      //   });
      // });

      // can also define normal handlers
      // controller.on('event', async(bot, message) => { ... });
    }
    // Any middlewares that should be automatically bound
    // Can include more than 1 of each kind.
    // middleware: {
    //     ingest: [
    //         (bot, message, next) => { next(); }
    //     ],
    //     receive: [
    //         (bot, message, next) => { next(); }
    //     ],
    //     send: [
    //         (bot, message, next) => { next(); }
    //     ]
    // },
    // this method will live at controller.plugins.myplugin.customMethod()
    // customMethod: async() => {}
  };
};
