const User = require("../../models/user-model");
const Event = require("../../models/event-model");
const Slack = require("../../models/slack-model");
const db = require("../../routers/routers");
const googleCal = require("../../routers/googleCal-routes");

module.exports = botkit => {
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: 'user-routes.js',
    init: (controller) => {
      function userRoutes(req, res, next) {

      controller.webserver.get('/user/profile', async (req, res) => {
        // console.log("he", res);
        let user;
        if(req.isAuthenticated()) {
        try {
            user = req.user
            console.log("|--User info---|", user)
            // console.log("<-=-=-=-=- req.user =-=-=-=-=->\n", req);
            console.log('<-=-=-=-=- Success! =-=-=-=->\n');
            res.send({ success: true, userInfo: user });
          } catch (err) {
            res.send({ success: false });
          }
        }
        res.send({ success: false });
        // res.status(200).json({ success: true, userInfo: user });
      });

        controller.webserver.get("/user/info", async (req, res) => {
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

        controller.webserver.get("/user/info/:id", async (req, res) => {
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

        controller.webserver.post("/user/add/new", async (req, res) => {
          const { end_date, start_date, msg, email, slackRef } = req.body;
          const googleObj = { end_date, start_date, email };
          let user;
          if (req.isAuthenticated()) {
            user = req.session.passport.user;
            console.log("|---User info in Post add Event|\n", user);
          }

          try {
            const savedEvent = await Slack.findOne({
              _id: slackRef
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

                db.add_date(newEvent);
              });
            googleCal.add_to_google(googleObj);
            res.status(200).json({ savedEvent });

          // x = { ...req.body, slackId, team_id };
          // const vacation_added = await db.add_date(x);
          // return res.status(200).json({ vacation_added });
        } catch (err) {
          res.status(500).json({ message: err });
        }
        })

        next();
      }
      controller.webserver.use("/user", userRoutes);
      }
    };
  }