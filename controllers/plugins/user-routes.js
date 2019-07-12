const NodeCron = require("../../config/node-con");
// const botkitRouter = require("../../routers/botkitRouter");
const bodyParser = require("body-parser");
const User = require("../../models/user-model");
const Event = require("../../models/event-model");
const Slack = require("../../models/slack-model");
const db = require("../../routers/routers");

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
        await User.findOne({
          email: req.user[0].email
        })
          .populate("slack")
          .exec(async (err, info) => {
            console.log("Slack Info:\n", info);
            console.log("|---Access---|\n", info.slack[0].team_id);

            await Event.find({
              teamID: info.slack[0].team_id,
              slackID: info.slack[0].slackId
            })
              .populate("message")
              .exec((err, event) => {
                console.log("|---Event Info---|\n", event);
                res.send(event);
              });
          });
      });

      controller.webserver.get("/info/:id", async (req, res) => {
        const { id } = req.params;

        await User.findOne({
          _id: id
        })
          .populate("slack")
          .exec(async (err, info) => {
            await Event.find({
              teamID: info.slack[0].team_id,
              slackID: info.slack[0].slackId
            })
              .populate("message")
              .exec((err, event) => {
                res.send(event);
              });
          });
      });

      controller.webserver.post("/add/new", async (req, res) => {
        const { end_date, start_date, msg } = req.body;
        try {
          const savedEvent = await Slack.findOne({
            _id: req.body.slackRef
          })
            .populate("slack")
            .then(res => {
              const { slackId, team_id } = res;
              let newEvent = {
                end_date,
                start_date,
                msg,
                userID: slackId,
                teamID: team_id
              };

              const vacation_added = db.add_date(newEvent);
              return vacation_added;
            });

          return res.status(200).json({ savedEvent });

          // console.log("slackid---->", getSlackID);
          // const { slackId, team_id } = getSlackID;

          // x = { ...req.body, slackId, team_id };
          // const vacation_added = await db.add_date(x);
          // return res.status(200).json({ vacation_added });
        } catch (err) {
          return res.status(500).json({ message: err });
        }
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
