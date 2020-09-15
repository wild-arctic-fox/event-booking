const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const { buildSchema } = require("graphql"); //fn
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const EventModel = require("./models/event");
const UserModel = require("./models/user");
const user = require("./models/user");

///////////////////////////////////////////////////
// global vars
const PORT = process.env.PORT || 3000;

///////////////////////////////////////////////////
// global function definition
const getEvents = async (ids) => {
  try {
    const events = await EventModel.find({ _id: { $in: ids } });
    events.map((event) => {
      return {
        ...event._doc,
        creator: getUser.bind(this, event.creator),
      };
    });
    return events;
  } catch (err) {
    throw err;
  }
};

const getUser = async (id) => {
  try {
    const user = await UserModel.findById(id);
    return {
      ...user._doc,
      userEvents: getEvents.bind(this, user._doc.userEvents),
    };
  } catch (err) {
    throw err;
  }
};
//
///////////////////////////////////////////////////


///////////////////////////////////////////////////
// Create app
///////////////////////////////////////////////////
const app = express();


///////////////////////////////////////////////////
// Use middleware
///////////////////////////////////////////////////
app.use(bodyParser.json()); // Returns middleware that only parses json
app.use(
  "/graphql",
  graphqlHTTP({
    // configure api
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }

        type User {
            _id: ID!
            email: String!
            password: String
            userEvents: [Event!]
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
        }

        input UserInput {
            email: String!
            password: String!
        }
    
        type RootQuery {
            events: [Event!]!
            users: [User!]!
        }

        type RootMutation {
            createEvent(eInput: EventInput): Event
            createUser(uInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          const res = await EventModel.find();
          return res.map((item) => {
            return {
              ...item._doc,
              creator: getUser.bind(this, item._doc.creator),
            };
          });
        } catch (e) {
          throw e;
        }
      },
      createEvent: async (args) => {
        try {
          const event = new EventModel({
            title: args.eInput.title,
            description: args.eInput.description,
            price: +args.eInput.price,
            date: new Date(),
            creator: "5f5fafb4093a6138505f9179",
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
              password,
            });
            const e = await user.save();
            return { ...e._doc, password: null };
          }
        } catch (e) {
          throw e;
        }
      },
    },
    graphiql: true,
  })
);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gehfl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
