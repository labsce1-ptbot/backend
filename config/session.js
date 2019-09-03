// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const passport = require("passport");
// const session = require("express-session");
// const bodyParser = require("body-parser");

// module.exports = controller => {
//   controller.webserver.use(
//     express.json(),
//     cors({
//       origin: process.env.ORIGIN,
//       credentials: true
//     }),
//     helmet(),
//     session({
//       secret: process.env.secret,
//       saveUninitialized: false,
//       resave: false
//     }),
//     bodyParser.urlencoded({
//       limit: "50mb",
//       extended: true,
//       parameterLimit: 50000
//     }),
//     bodyParser.json({ limit: "50mb", extended: true }),
//     passport.initialize(),
//     passport.session()
//   );
// };
