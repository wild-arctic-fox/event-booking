const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "EventModel",
      autopopulate: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      autopopulate: true
    },
  },
  //The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema
  { timestamps: true }
);

bookingSchema.plugin(autopopulate);

module.exports = mongoose.model("BookingModel", bookingSchema);
