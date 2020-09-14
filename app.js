const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const { buildSchema } = require("graphql"); //fn
const mongoose = require("mongoose");
const EventModel = require("./models/event");

// global vars
const PORT = process.env.PORT || 3000;

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
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
        }
    
        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvents(eInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return EventModel.find()
          .then((res) => {
            return res.map((item) => {
              return { ...item._doc };
            });
          })
          .catch((e) => {
            throw e;
          });
      },
      createEvents: async (args) => {
        const event = new EventModel({
          title: args.eInput.title,
          description: args.eInput.description,
          price: +args.eInput.price,
          date: new Date(),
        });
        try {
          const e = await event.save();
          return { ...e._doc };
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
