const Query = {
    users: (root, args, { db: { users } }, info) => {
        const { query } = args;
        return !query
            ? users
            : users.filter(({ id, name, email, age }) =>
                name.toLowerCase().includes(query.toLowerCase())
            );
    },
    posts: (root, args, { db: { posts } }, info) => {
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
    post: (root, args, { db: { posts, comments } }, info) =>
        posts.find(post => post.id === args.data.id),
    comments: () => comments,
}

export { Query as default }