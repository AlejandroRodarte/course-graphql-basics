import { GraphQLServer } from 'graphql-yoga';

// 1. Type definitions
// inside the template string goes GraphQL code
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`;

// 2. Resolvers
// usually mirrors the type definition structure
// we have one method for each query we set up above
const resolvers = {
    Query: {
        id() {
            return 'abc123';
        },
        name() {
            return 'Alejandro Rodarte';
        },
        age() {
            return 23;
        },
        employed() {
            return false;
        },
        gpa() {
            return 3.4;
            // return null is also valid in this field
        }
    }
};

// set up the GraphQL server
const server = new GraphQLServer({
    typeDefs,
    resolvers
});

// kickstart the server (default port: 4000)
server.start(() => {
    console.log('The server is up!');
});