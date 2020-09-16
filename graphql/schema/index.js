const { buildSchema } = require("graphql"); //fn

module.exports = buildSchema(`
        type AuthData{
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }

        type Booking{
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }

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
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }

        type RootMutation {
            createEvent(eInput: EventInput): Event
            createUser(uInput: UserInput): User
            bookEvent(eId: ID!): Booking!
            cancelBooking(bId: ID!): Event!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);
