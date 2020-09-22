const EventModel = require("../../models/event");
const BookingModel = require("../../models/booking");
const { dateToString } = require("../../helpers/date");

module.exports = {
  ///////////////////////////////////////////////////
  // Return all bookings if exist
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unautheticated!");
    }
    try {
      const res = await BookingModel.find();
      return res.map((item) => {
        return {
          ...item._doc,
          createdAt: dateToString(item._doc.createdAt),
          updatedAt: dateToString(item._doc.updatedAt),
        };
      });
    } catch (e) {
      throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Create new Booking
  bookEvent: async ({ eId }, req) => {
    if (!req.isAuth) {
      throw new Error("Unautheticated!");
    }
    try {
      const event = await EventModel.findById(eId);
      const booking = new BookingModel({
        event,
        user: req.userId,
      });
      const res = await booking.save();
      return {
        ...res,
        _id: res._id,
        createdAt: dateToString(res._doc.createdAt),
        updatedAt: dateToString(res._doc.updatedAt),
      };
    } catch (e) {
      throw e;
    }
  },

  ///////////////////////////////////////////////////
  // Delete existing Booking
  cancelBooking: async ({ bId }, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unautheticated!");
      }
      const { event } = await BookingModel.findById(bId);
      await BookingModel.findByIdAndDelete(bId);
      return event;
    } catch (e) {
      throw e;
    }
  },
};
