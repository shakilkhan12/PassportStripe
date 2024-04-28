const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    // required: true,
  },
  password: {
    type: String,
    required: false,
    // required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: true,
    enum: ["local", "google", "github"],
  },
  google: {
    type: Map,
    required: false,
  },
  github: {
    type: Map,
    required: false,
  },
});
const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
