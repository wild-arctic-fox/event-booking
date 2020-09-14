const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const { buildSchema } = require("graphql"); //fn

// global vars
const PORT = process.env.PORT || 3000;
const events = [];

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
          return events;
      },
      createEvents: (args) => {
          const event = {
              _id: Math.random().toString(),
              title: args.eInput.title,
              description: args.eInput.description,
              price: +args.eInput.price,
              date: new Date().toISOString()
          };
          events.push(event);
          return event;
      },
    },
    graphiql:true
  })
);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.listen(PORT);
