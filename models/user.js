const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');

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
      ref: 'EventModel',
      autopopulate: true
  }]
});

userSchema.plugin(autopopulate);

module.exports = mongoose.model("UserModel", userSchema);
