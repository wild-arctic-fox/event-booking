const EventModel = require("../../models/event");
const BookingModel = require("../../models/booking");
const {dateToString} = require('../../helpers/date');

module.exports = {
  ///////////////////////////////////////////////////
  // Return all bookings if exist
  bookings: async () => {
    try {
      const res = await BookingModel.find();
      return res.map((item) => {
        return {
          ...item._doc,
          createdAt: dateToString(item._doc.createdAt),
          updatedAt: dateToString(item._doc.updatedAt)
        };
      });
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
          createdAt: dateToString(res._doc.createdAt),
          updatedAt: dateToString(res._doc.updatedAt)
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
