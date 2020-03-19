import { GraphQLServer ,PubSub} from 'graphql-yoga';
import db from './db';
import Query from './resolvers/Query';
import Post from './resolvers/Post';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'




const pubsub = new PubSub()

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers : {
		Query,
		Mutation,
		Subscription,
		Post,
		Comment,
		User
	},
	context: {
		db,pubsub
	}
});

server.start(() => console.log('Server is running...'));
