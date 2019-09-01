import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid';
import db from './db';

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
        users(parent, args, { db }, info) {

            // no query: return all users
            if (!args.query) {
                return db.users;
            }

            // query: search for matches of query string with the user name and return filtered array
            return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));

        },

        // the 'posts' query resolver
        posts(parent, args, { db }, info) {

            // no query: return all posts
            if (!args.query) {
                return db.posts;
            }

            // query: return all posts that match the search query either in the post title or in the post body
            return db.posts.filter(post => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase());
            });

        },

        // the 'comments' query resolver: return all comments (part 1)
        comments(parent, args, { db }, info) {
            return db.comments;
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

    // our mutation handlers (resolvers)
    Mutation: {

        // create a new user
        createUser(parent, args, { db }, info) {

            // check if email is already taken
            const emailTaken = db.users.some(user => user.email === args.data.email);

            // if so, throw error
            if (emailTaken) {
                throw new Error('Email is already in use.');
            }

            // create new user: generate a new random id
            const user = {
                id: uuidv4(),
                ...args.data
            };

            // add the user (in array)
            db.users.push(user);

            // response
            return user;

        },

        // create a post
        createPost(parent, args, { db }, info) {

            // check if user exists given the author id through the arguments
            const userExists = db.users.some(user => user.id === args.data.author);

            // user does not exist: throw error
            if (!userExists) {
                throw new Error('Attempted to add a new post to a non-existent user.');
            }

            // create a new post: generate a random id
            const post = {
                id: uuidv4(),
                ...args.data
            };

            // push the new post
            db.posts.push(post);

            // response
            return post;

        },

        // create a new comment
        createComment(parent, args, { db }, info) {

            // check if user exists
            const userExists = db.users.some(user => user.id === args.data.author);

            // user does not exist: throw error
            if (!userExists) {
                throw new Error('Attempted to add a new comment to a non-existent user.')
            }

            // check if post exists and is published
            const postAvailable = db.posts.some(post => (post.id === args.data.post) && (post.published === true));

            // post does not exist or is not published: throw error
            if (!postAvailable) {
                throw new Error('Attempted to add a new comment to a non-existent or unpublished post.');
            }

            // create new comment
            const comment = {
                id: uuidv4(),
                ...args.data
            };

            // add the new comment
            db.comments.push(comment);

            // response
            return comment;

        },

        // delete a user by id (and all its posts and comments)
        deleteUser(parent, args, { db }, info) {

            // find user
            const userIndex = db.users.findIndex(user => user.id === args.id);

            // user not found: throw error
            if (userIndex === -1) {
                throw new Error('Attempted to delete non-existent user.')
            }

            // delete the user: get deleted user thanks to how splice() works
            const deletedUsers = db.users.splice(userIndex, 1);
            
            // filter posts
            db.posts = db.posts.filter(post => {

                // check if the post was made by that user
                const match = post.author === args.id;

                // filter out all comments that were related to that post
                if (match) {
                    db.comments = db.comments.filter(comment => comment.post !== post.id);
                }

                // filter all posts that were not made by that user
                return !match;

            });

            // delete all comments written by that user
            db.comments = db.comments.filter(comment => comment.author !== args.id);

            // return the deleted user
            return deletedUsers[0];

        },

        // delete a post by id
        deletePost(parent, args, { db }, info) {

            // search for the post
            const postIndex = db.posts.findIndex(post => post.id === args.id);

            // post not found: throw error
            if (postIndex === -1) {
                throw new Error('Attempted to delete a non-existent post.');
            }
            
            // delete and get deleted post
            const deletedPosts = db.posts.splice(postIndex, 1);

            // filter our comments that were not related to that post
            db.comments = db.comments.filter(comment => comment.post !== args.id);

            // return deleted post
            return deletedPosts[0];

        },

        // delete comment by id
        deleteComment(parent, args, { db }, info) {

            // search for the comment
            const commentIndex = db.comments.findIndex(comment => comment.id === args.id);

            // comment not found; throw error
            if (commentIndex === -1) {
                throw new Error('Attempted to delete a non-existent comment.');
            }

            // delete the comment and get it back
            const deletedComments = db.comments.splice(commentIndex, 1);

            // return the deleted comment
            return deletedComments[0];

        }

    },

    // resolver when accessing a User given a Post: get User by matching its primary key (id)
    // with the Post's author foreign key (owner, parent)
    Post: {

        author(parent, args, { db }, info) {
            return db.users.find(user => user.id === parent.author); 
        },

        // resolver when accessing Comments given a particular Post, get Comments where its 'post' foreign key
        // match the parent's (post) primary key id
        comments(parent, args, { db }, info) {
            return db.comments.filter(comment => comment.post === parent.id);
        }

    },

    // resolver when accessing Posts given a User, get all Posts that match their foreign key with the
    // user's id (parent)
    User: {

        posts(parent, args, { db }, info) {
            return db.posts.filter(post => parent.id === post.author);
        },

        // resolver when accessing Comments given a User, get all Comments that match the User primary key (id, parent)
        // with the Comment foreign key (owner, user id)
        comments(parent, args, { db }, info) {
            return db.comments.filter(comment => parent.id === comment.author);
        }

    },

    // resolver when accessing User given a Comment: find User that matches its primary key (id) with the comments id (parent)
    Comment: {

        author(parent, args, { db }, info) {
            return db.users.find(user => user.id === parent.author);
        },

        // resolver when accessing a Post given a Comment, search for the post where its primary key (id) matches the parent 'post'
        // foreign key (Comment)
        post(parent, args, { db }, info) {
            return db.posts.find(post => post.id === parent.post);
        }

    }

};

// set up the GraphQL server
// typeDefs: pointer to the file that has our type definitions
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

// kickstart the server (default port: 4000)
server.start(() => {
    console.log('The server is up!');
});