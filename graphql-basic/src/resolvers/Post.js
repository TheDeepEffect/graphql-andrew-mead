const Post = {
    author: (parent, args, { db: { users } }, info) =>
        users.find(user => user.id === parent.author),
    comments: (parent, aargs, { db: { comments } }, info) => comments.filter(com => com.post === parent.id),
}

export { Post as default }