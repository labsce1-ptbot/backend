const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {type: String, required: true, max: 15, unique: true},
  password: {type: String, required: true}
})

User = module.exports = mongoose.model("User", UserSchema)