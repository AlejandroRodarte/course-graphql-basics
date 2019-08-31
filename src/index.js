import { GraphQLServer } from 'graphql-yoga';

// 1. Type definitions
// inside the template string goes GraphQL code

// type Query: define a query we can make
// type <Name>: define a custom type with fields

// type User defines how the custom 'User' model is structured
// the 'me' query allows to return a User model

// the 'Post' type is a custom object with id, title, body and published flag
// 'post' query returns a post
const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }

`;

// 2. Resolvers
// usually mirrors the type definition structure
// we have one method for each query we set up above

// the 'me' resolver associated with the 'me' query has a method that
// returns a User model

// the 'post' resolver associated with the 'post' query returns a Post model
const resolvers = {
    Query: {

        me() {
            return {
                id: '123890',
                name: 'Alejandro',
                email: 'alejandrorodarte1@gmail.com',
                age: 15
            };
        },

        post() {
            return {
                id: 'abcxyz',
                title: 'My Post Title',
                body: 'My Post Description',
                published: false
            };
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