const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const mongoose = require("mongoose");
const isAuthMiddleware = require('./middleware/isAuth');

///////////////////////////////////////////////////
// Global vars
const PORT = process.env.PORT || 3000;


///////////////////////////////////////////////////
// Create app
///////////////////////////////////////////////////
const app = express();


///////////////////////////////////////////////////
// Use middleware
///////////////////////////////////////////////////
app.use(bodyParser.json()); // Returns middleware that only parses json
app.use(isAuthMiddleware);
app.use(
  "/graphql",
  graphqlHTTP({
    // configure api
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true
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
