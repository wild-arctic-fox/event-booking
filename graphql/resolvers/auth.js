const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user");
const jsonwebtoken = require('jsonwebtoken');

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
  },
  
  //////////////////////////////////////
  // Sign in function
  login: async ({email, password}) => {
    const user = await UserModel.findOne({email});
    if(!user){
        throw new Error('No user with this email');
    }
    const isEq = await bcrypt.compare(password, user.password);
    if(isEq){
        const token = jsonwebtoken.sign({userId:user.id, email:user.email},'supersecretkey',{
            expiresIn: '1h'
        });
        return {userId:user.id, token, tokenExpiration:1}
    } else {
        throw new Error('Incorrect password');
    }
  }
};
