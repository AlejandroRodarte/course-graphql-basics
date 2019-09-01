import uuidv4 from 'uuid';

// our mutation handlers (resolvers)
const Mutation = {

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

};

export { Mutation as default };