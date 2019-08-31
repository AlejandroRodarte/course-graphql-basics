import { GraphQLServer } from 'graphql-yoga';

// demo user data
const users = [
    {
        id: '1',
        name: 'Alejandro',
        email: 'alex@example.com'
    },
    {
        id: '2',
        name: 'Patricia',
        email: 'paty@example.com',
        age: 61
    },
    {
        id: '3',
        name: 'Magdaleno',
        email: 'mag@example.com',
        age: 58
    }
];

// demo post data
const posts = [
    {
        id: '1',
        title: 'Why are people always so mad?',
        body: 'Is everyone stupid or what? I do not understand.',
        published: false
    },
    {
        id: '2',
        title: 'How are we not deserving of dog love',
        body: 'They are so cute ad we are humans are pretty despicable.',
        published: true
    },
    {
        id: '3',
        title: 'What makes me one of the worst failure sons of all time',
        body: 'I am unemployed taking courses on Udemy to replace school. Fuck my life.',
        published: false
    }
];

// 1. Type definitions
// inside the template string goes GraphQL code

// type Query: define a query we can make
// type <Name>: define a custom type with fields

// type User defines how the custom 'User' model is structured
// the 'me' query allows to return a User model

// the 'Post' type is a custom object with id, title, body and published flag
// 'post' query returns a post

// operation argument are attached at the right of the query name as if it was a function

// the 'users' query returns an array of the 'User' custom type that matches the 'User' type definition
// and it accepts a query string (optional)

// the 'posts' query returns an array of 'Post' custom types and accepts an optional query string
const typeDefs = `

    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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

// all resolvers have injected 4 arguments

// parent: information about the parent of the model to work with (useful when working with relational data)
// example - determine the User (parent) that wrote a Post (children)

// args: the actual operation arguments incoming from the client
// ctx: the context (example - the id of a logged in user)
// info: information about the operations being made in the request process
const resolvers = {

    Query: {

        // the 'users' query resolver
        users(parent, args, ctx, info) {

            // no query: return all users
            if (!args.query) {
                return users;
            }

            // query: search for matches of query string with the user name and return filtered array
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));

        },

        // the 'posts' query resolver
        posts(parent, args, ctx, info) {

            // no query: return all posts
            if (!args.query) {
                return posts;
            }

            // query: return all posts that match the search query either in the post title or in the post body
            return posts.filter(post => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });

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