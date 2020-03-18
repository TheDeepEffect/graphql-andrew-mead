import { GraphQLServer } from 'graphql-yoga';

//Demo data
let users = [
	{
		id: '1',
		name: 'User 1',
		email: 'yourown@email.com',
	},
	{
		id: '2',
		name: 'Use your name 1',
		email: 'yourown1@email.com',
	},
	{
		id: '3',
		name: 'Use your name 2',
		email: 'yourown2@email.com',
	},
];

let posts = [
	{
		id: 'po$1',
		title: 'GraphQL 101',
		body: '',
		published: true,
		author: '1',
	},
	{
		id: 'po$2',
		title: 'GraphQL 102',
		body: 'GraphQL type',
		published: false,
		author: '2',
	},
	{
		id: 'po$3',
		title: 'GraphQL 103',
		body: 'no GraphQL type',
		published: true,
		author: '1',
	},
];
let comments = [
	{ id: 'com$1', content: 'Worksss!!', author: '2', post: 'po$1' },
	{ id: 'com$2', content: 'Delete Worksss!!', author: '1', post: 'po$2' },
];

//Typedefs (aka Schema)
const typeDefs = `
    type Query{
		users(query: String):[User!]!
		posts(query: String):[Post!]!
		me: User!
		post(id: ID!):Post!
		comments:[Comment!]!
	}
	type Mutation{
		createUser(data : CreateUserInput) :User!
		deleteUser(id:ID!): User!
		createPost(data:CreaatePostInput):Post!
		deletePost(id:ID):Post!
		createComment(data:CreateCommentInput): Comment!
	}
	input CreateUserInput{
		name: String!
		email: String!
		age: Int
	}
	input CreaatePostInput{
		title: String!
		body: String!
		published: Boolean!
		author:ID!
	}
	input CreateCommentInput{
		content: String!
		post: ID!
		author:ID!
	}

	type User{
		id: ID!
		name: String!
		email: String!
		age: Int
		posts:[Post!]!
		comments:[Comment!]!

	}
	type Post{
		id: ID!
		title: String!
		body: String!
		published: Boolean!
		author: User!
		comments:[Comment!]!

	}
	type Comment{
		id: ID!
		content: String!
		author:User!
		post:Post!
	}

`;

//Resolvers
const resolvers = {
	Query: {
		users: (root, args, context, info) => {
			const { query } = args;
			return !query
				? users
				: users.filter(({ id, name, email, age }) => name.toLowerCase().includes(query.toLowerCase()));
		},
		posts: (root, args, context, info) => {
			const { query } = args;
			return !query
				? posts
				: posts.filter(
						({ id, title, body, published }) =>
							title.toLowerCase().includes(query.toLowerCase()) ||
							body.toLowerCase().includes(query.toLowerCase())
				  );
		},
		me: () => {
			return {
				id: '123mike',
				name: 'mike',
				email: 'mike@examples.com',
				age: 28,
			};
		},
		post: (root, args, context, info) => posts.find(post => post.id === args.data.id),
		comments: () => comments,
	},
	Mutation: {
		createUser: (root, args, context, info) => {
			// const { name, email, age } = args;

			const user = {
				...args.data,
				id: Math.random()
					.toString()
					.substr(3, 3),
			};
			users.push(user);
			return user;
		},
		deleteUser: (root, args, context, info) => {
			const user = users.some(user => user.id === args.id)
				? users.find(user => user.id === args.id)
				: new Error('No such user to delete!!');

			users.splice(users.indexOf(user), 1);
			posts = posts.filter(post => post.author !== args.id);
			comments = comments.filter(c => c.author !== args.id);
			console.log(users);
			console.log(posts);
			console.log(comments);
			return user;
		},
		createPost: (root, args, context, info) => {
			// const { title, body, author, published } = args;
			if (!users.some(user => user.id === args.data.author)) {
				throw new Error('No user found.');
			}
			const post = {
				...args.data,
				id: Math.random()
					.toString()
					.substr(3, 3),
			};
			posts.push(post);
			return post;
		},
		deletePost: (root, args, context, info) => {
			const postIndex = post.findIndex(post => post.id === args.id);
			if (postIndex === -1) throw new Error('No such post to delete.');
			comments = comments.filter(c => c.post !== args.id);

			return posts.splice(postIndex, 1);
		},
		createComment: (root, args, context, info) => {
			// const { content, post, author } = args;
			const userExists = users.some(user => user.id === args.data.author);
			const postExists = posts.some(post => post.id === args.data.post);

			if (!userExists) throw new Error(`User doesn't exist`);
			if (!postExists) throw new Error(`Post doesn't exist`);

			const comment = {
				...args.data,
				id: Math.random()
					.toString()
					.substr(3, 3),
			};
			comments.push(comment);
			return comment;
		},
	},
	Post: {
		author: (parent, args, context, info) => users.find(user => user.id === parent.author),
		comments: parent => comments.filter(com => com.post === parent.id),
	},
	User: {
		posts: (parent, args, context, info) => {
			return posts.filter(post => {
				return post.author === parent.id;
			});
		},
		comments: parent => comments.filter(com => com.author === parent.id),
	},
	Comment: {
		author: parent => users.find(user => user.id === parent.author),
		post: (parent, args, context, info) => posts.find(post => post.id === parent.post),
	},
};

const server = new GraphQLServer({
	typeDefs,
	resolvers,
});

server.start(() => console.log('Server is running...'));
