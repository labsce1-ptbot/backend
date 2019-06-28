const NodeCron = require("../../config/node-con");
// const botkitRouter = require("../../routers/botkitRouter");
const bodyParser = require("body-parser");
const users = require("../../models/user-model");
const { userRoutes } = require("../../routers/users/usersRoutes");

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
          } catch (err) {
            return res.status(500).json({ success: false });
          }
        }
        console.log("<-=-=-=-=- Success! =-=-=-=->\n");
        res.status(200).json({ success: true, userInfo: user });
      });

      controller.webserver.get("/hey", async (req, res) => {
        console.log(res);
        res.send("hey yourself");
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
