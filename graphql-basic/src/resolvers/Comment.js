const Comment = {
    author: (parent, args, { db: { users } }, info) => users.find(user => user.id === parent.author),
    post: (parent, args, { db: { posts } }, info) =>
        posts.find(post => post.id === parent.post),
}

export { Comment as default }