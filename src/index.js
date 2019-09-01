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
// now adding the 'author' property which will hold the user's id that made the post
const posts = [
    {
        id: '10',
        title: 'Why are people always so mad?',
        body: 'Is everyone stupid or what? I do not understand.',
        published: false,
        author: '1'
    },
    {
        id: '11',
        title: 'How are we not deserving of dog love',
        body: 'They are so cute ad we are humans are pretty despicable.',
        published: true,
        author: '1'
    },
    {
        id: '12',
        title: 'What makes me one of the worst failure sons of all time',
        body: 'I am unemployed taking courses on Udemy to replace school. Fuck my life.',
        published: false,
        author: '2'
    }
];

// dummy comments
// added an author id to identify who wrote the comment
// also added a post id to identify what post owns this comment
const comments = [
    {
        id: '100',
        text: 'This is pure non-sense.',
        author: '2',
        post: '10'
    },
    {
        id: '101',
        text: 'How did you formulate this opinion?',
        author: '3',
        post: '12'
    },
    {
        id: '102',
        text: 'Lol that was not funny.',
        author: '3',
        post: '11'
    },
    {
        id: '103',
        text: 'Kono Dio Da!',
        author: '1',
        post: '11'
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

// many posts are associated with one user: to associate a post with a user, declare a new field in the 
// Post type definition which will be of type User

// the 'User' type definiton has now a 'posts' fields which will hold an array of Posts that were created by a user

// the 'Comment' type definition with id and text required fields
// added a 'comments' query which returns an array of comment custom types

// added to the 'Comment' type an 'author' field that holds the User that wrote such Comment
// added to the 'User' type a 'comments' field that holds an array of Comment objects that the User wrote

// added to the 'Comment' type a 'post' field that holds the Post object that owns that comment
// added to the 'Post' type a 'comments' field that holds the Comments related to that Post
const typeDefs = `

    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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

        // the 'comments' query resolver: return all comments (part 1)
        comments(parent, args, ctx, info) {
            return comments;
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

    },

    // resolver when accessing a User given a Post: get User by matching its primary key (id)
    // with the Post's author foreign key (owner, parent)
    Post: {

        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author); 
        },

        // resolver when accessing Comments given a particular Post, get Comments where its 'post' foreign key
        // match the parent's (post) primary key id
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.post === parent.id);
        }

    },

    // resolver when accessing Posts given a User, get all Posts that match their foreign key with the
    // user's id (parent)
    User: {

        posts(parent, args, ctx, info) {
            return posts.filter(post => parent.id === post.author);
        },

        // resolver when accessing Comments given a User, get all Comments that match the User primary key (id, parent)
        // with the Comment foreign key (owner, user id)
        comments(parent, args, ctx, info) {
            return comments.filter(comment => parent.id === comment.author);
        }

    },

    // resolver when accessing User given a Comment: find User that matches its primary key (id) with the comments id (parent)
    Comment: {

        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author);
        },

        // resolver when accessing a Post given a Comment, search for the post where its primary key (id) matches the parent 'post'
        // foreign key (Comment)
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.post);
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