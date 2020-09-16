const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user");

module.exports = {
  //////////////////////////////////////
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
  }
};
