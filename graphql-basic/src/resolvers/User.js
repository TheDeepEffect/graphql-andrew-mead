const User = {
    posts: (parent, args, { db: { posts } }, info) => {
        return posts.filter(post => {
            return post.author === parent.id;
        });
    },
    comments: (parent, args, { db: { comments } }, info) => comments.filter(com => com.author === parent.id),
}

export { User as default }