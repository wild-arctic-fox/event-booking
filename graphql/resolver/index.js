const bcrypt = require("bcryptjs");
const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const BookingModel = require("../../models/booking");

module.exports = {
  ///////////////////////////////////////////////////
  // Return all bookings if exist
  bookings: async () => {
    try {
      const res = await BookingModel.find();
      return res.map((item) => {
        return {
          ...item._doc,
          createdAt: new Date(item._doc.createdAt).toISOString(),
          updatedAt: new Date(item._doc.updatedAt).toISOString()
        };
      });
    } catch (e) {
      throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Return all events
  events: async () => {
    try {
      const res = await EventModel.find();
      return res.map((item) => {
        return { ...item._doc, date: new Date(item._doc.date).toISOString };
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
        date: new Date().toISOString(),
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
  },

  ///////////////////////////////////////////////////
  // Create new User & put in the DB
  createUser: async (args) => {
    try {
      const existedUser = await UserModel.findOne({
        email: args.uInput.email,
      });
      if (existedUser) {
        throw new Error("User with this email already exist");
      } else {
        const password = await bcrypt.hash(args.uInput.password, 13);
        const user = new UserModel({
          email: args.uInput.email,
          password
        });
        const e = await user.save();
        return { ...e._doc, password: null };
      }
    } catch (e) {
      throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Create new Booking
  bookEvent: async ({eId}) => {
    try {
      const event = await EventModel.findById(eId);
      const booking = new BookingModel({
          event,
          user: '5f5faefe4a3211399cd0ecce'
      });
      const res = await booking.save();
      return {
          ...res,
          _id: res._id,
          createdAt: new Date(res._doc.createdAt).toISOString(),
          updatedAt: new Date(res._doc.updatedAt).toISOString()
      }
    } catch (e) {
        throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Delete existing Booking
  cancelBooking: async ({bId}) => {
    const {event} = await BookingModel.findById(bId);
    await BookingModel.findByIdAndDelete(bId);
    return event;
  }
};
