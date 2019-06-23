const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: {type: String, required: true, max: 15, unique: true},
  first_name: {type: String, required: true},
  last_name: { type: String, required: true},
  email: {type: String, required: true, unique: true},
  picture: {type: String} 
})

User = module.exports = mongoose.model("User", UserSchema)