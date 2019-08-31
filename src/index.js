import { GraphQLServer } from 'graphql-yoga';

// 1. Type definitions
// inside the template string goes GraphQL code
const typeDefs = `
    type Query {
        id: ID!
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        inStock: Boolean!
    }
`;

// 2. Resolvers
// usually mirrors the type definition structure
// we have one method for each query we set up above
const resolvers = {
    Query: {
        id() {
            return 'ef9ae3';
        },
        title() {
            return 'Mayonnaise';
        },
        price() {
            return 19.99;
        },
        releaseYear() {
            return 2022;
        },
        rating() {
            return null;
        },
        inStock() {
            return true;
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