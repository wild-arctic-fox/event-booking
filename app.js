const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const { buildSchema } = require("graphql"); //fn

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
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvents(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ["E1", "E2", "E3"];
      },
      createEvents: (args) => {
          const eName =  args.name;
          return eName;
      },
    },
    graphiql:true
  })
);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

app.listen(PORT);
