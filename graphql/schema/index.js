const { buildSchema } = require("graphql"); //fn

module.exports = buildSchema(`
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
    `);
