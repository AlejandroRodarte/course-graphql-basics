import { GraphQLServer } from 'graphql-yoga';

// 1. Type definitions
// inside the template string goes GraphQL code

// type Query: define a query we can make
// type <Name>: define a custom type with fields

// type User defines how the custom 'User' model is structured
// the 'me' query allows to return a User model

// the 'Post' type is a custom object with id, title, body and published flag
// 'post' query returns a post

// operation argument are attached at the right of the query name as if it was a function

// the 'grades' query returns an array of integers as it is defined on its return type syntax
// the 'add' query now accepts as an argument from the client an array of floats
const typeDefs = `

    type Query {
        greeting(name: String, position: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
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

        // all resolvers have injected 4 arguments

        // parent: information about the parent of the model to work with (useful when working with relational data)
        // example - determine the User (parent) that wrote a Post (children)

        // args: the actual operation arguments incoming from the client
        // ctx: the context (example - the id of a logged in user)
        // info: information about the operations being made in the request process
        greeting(parent, args, ctx, info) {

            if (args.name && args.position) {
                return `Hello ${args.name}! You are my favorite ${args.position}!`;
            } else {
                return 'Hello!';
            }

        },

        // the 'add' resolver has in its 'args' argument the array of numbers to work with in the server-side
        add(parent, args, ctx, info) {

            if (args.numbers.length === 0) {
                return 0;
            }

            return args.numbers.reduce((accumulator, currentValue) => accumulator + currentValue);

        },

        // returning an array of scalar-types
        grades(parent, args, ctx, info) {
            return [99, 80, 93];
        },

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