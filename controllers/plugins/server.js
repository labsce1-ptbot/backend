const NodeCron = require("../../config/node-con");
// const botkitRouter = require("../../routers/botkitRouter");

module.exports = function(botkit) {
  // NodeCron();
  return {
    // The name of the plugin. Used to log messages at boot time.
    name: "server.js",

    // initialize this module. called at load time.
    init: function(controller) {
      // do things like:

      // expose the methods from this plugin as controller.plugins.myplugin.<method>
      // controller.addPluginExtension('myplugin', this);

      // make locally bundled content public on the webservice:
      // controller.publicFolder('/public/myplugin', __dirname + '/public);

      // add a web route
      controller.webserver.get("/myplugins", async (req, res) => {
        res.send("Hello World");
      });

      // controller.webserver.use("/api/messages", botkitRouter);

      // controller.webserver.use(
      //   cors({
      //     origin: process.env.ORIGIN || "http://localhost:3000",
      //     credentials: true
      //   }),
      //   helmet(),
      //   session({
      //     secret: process.env.secret,
      //     saveUninitialized: true,
      //     resave: true
      //   }),
      //   passport.initialize(),
      //   passport.session()
      // );
      controller.webserver.get("/logged", (req, res) => {
        res.send("Successfully Worked as far as authenticating");
      });

      controller.webserver.get("/failure", (req, res) => {
        res.send("Failure to authenticate");
      });

    }
  };
};
