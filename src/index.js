import { GraphQLServer } from 'graphql-yoga';

// 1. Type definitions
// inside the template string goes GraphQL code
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

// 2. Resolvers
// usually mirrors the type definition structure
// we have one method for each query we set up above
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!';
        },
        name() {
            return 'Alejandro Rodarte'
        },
        location() {
            return 'Ciudad Juarez, Chihuahua'
        },
        bio() {
            return 'I am an unemployed bastard'
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