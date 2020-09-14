const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userEvents: [{
      type: Schema.Types.ObjectId,
      ref: 'EventModel'
  }]
});

module.exports = mongoose.model("UserModel", userSchema);
