const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql"); //fn
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const mongoose = require("mongoose");
const isAuthMiddleware = require('./middleware/isAuth');

///////////////////////////////////////////////////
// Global vars
const PORT = process.env.PORT || 8000;


///////////////////////////////////////////////////
// Create app
///////////////////////////////////////////////////
const app = express();


///////////////////////////////////////////////////
// Use middleware
///////////////////////////////////////////////////

app.use(bodyParser.json()); // Returns middleware that only parses json
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method === 'OPTIONS'){
    res.sendStatus(200);
  }
  next();
});
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
  //res.send("Hello World!");
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.gehfl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log("Error !!!!!!! ",err);
  });
