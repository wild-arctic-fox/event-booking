const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const {dateToString} = require('../../helpers/date');

module.exports = {
  ///////////////////////////////////////////////////
  // Return all events
  events: async () => {
    try {
      const res = await EventModel.find();
      return res.map((item) => {
        return { ...item._doc, date: dateToString(item._doc.date) };
      });
    } catch (e) {
      throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Create new Event & put in the DB
  createEvent: async (args) => {
    try {
      const event = new EventModel({
        title: args.eInput.title,
        description: args.eInput.description,
        price: +args.eInput.price,
        date: dateToString(Date.now()),
        creator: "5f5fafb4093a6138505f9179"
      });
      const user = await UserModel.findById("5f5fafb4093a6138505f9179");
      if (!user) {
        throw new Error("No user with this ID");
      } else {
        user.userEvents.push(event);
        await user.save();
        const e = await event.save();
        return { ...e._doc };
      }
    } catch (e) {
      throw e;
    }
  }
};
