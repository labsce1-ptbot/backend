const express = require('express')
const users = require("../../models/user-model")
const { ensureAuthenticated } = require("../../config/auth0mw")

const router = express.Router()

router.get("/profile", async(req, res) => {
  let user;
  if (req.isAuthenticated()) {
    try {
      user = req.user
    } catch (err) {
      return res.status(500).json(err)
    }
  }
  res.status(200).json({user})
})

module.exports = router;