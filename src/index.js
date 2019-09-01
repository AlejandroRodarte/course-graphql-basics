import { GraphQLServer } from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

// set up the GraphQL server
// typeDefs: pointer to the file that has our type definitions
// resolvers: The imported resolvers from all the files
const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Post,
        Comment
    },
    context: {
        db
    }
});

// kickstart the server (default port: 4000)
server.start(() => {
    console.log('The server is up!');
});