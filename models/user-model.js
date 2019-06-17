const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {type: String},
  username: {type: String, required: true, max: 15, unique: true},
  password: {type: String},
  first_name: {type: String, required: true},
  last_name: { type: String, required: true},
  email: {type: String, required: true, unique: true},
  picture: {type: String} 
}, {autocreate: true})

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  trasnform: function (doc, ret) { delete ret._id }
})

User = module.exports = mongoose.model("User", UserSchema)