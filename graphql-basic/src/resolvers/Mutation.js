const Mutation = {
    createUser: (root, args, { db: { users } }, info) => {
        // const { name, email, age } = args;

        const user = {
            ...args.data,
            id: Math.random().toString().substr(3, 3),
        };
        users.push(user);
        return user;
    },
    deleteUser: (root, args, { db: { users, posts, comments } }, info) => {
        const user = users.some(user => user.id === args.id)
            ? users.find(user => user.id === args.id)
            : new Error('No such user to delete!!');

        users.splice(users.indexOf(user), 1);
        posts = posts.filter(post => post.author !== args.id);
        comments = comments.filter(c => c.author !== args.id);
        return user;
    },
    updateUser:(root,args,{db:{users}},info)=>{
        const {id,data}=args
        const user=users.find(user=>user.id===id)
        if(!user){
            throw new Error('No user to update')
        }

    },
    createPost: (root, args, { db: { posts,users },pubsub }, info) => {
        // const { title, body, author, published } = args;
        if (!users.some(user => user.id === args.data.author)) {
            throw new Error('No user found.');
        }
        const post = {
            ...args.data,
            id: Math.random().toString().substr(3, 3),
        };
        posts.push(post);
        if(post.published) pubsub.publish(`post`,{
            post:{mutation:'CREATED',data:post}
        })

        return post;
    },

    updatePost:(root,args,context,info)=>{
        const {db:{posts},pubsub} = context;
        const {id,data:{title,body,published}}=args
        const post = posts.find(post=>post.id===id)
        const originalPost={...post}

        if(!post){
            throw new Error('Post not found!')
        }
        if(typeof title==="string") post.title=title
        if(typeof body === 'string') post.body===body
        if(typeof published === 'boolean') post.published===published


        if(originalPost.published && !post.published){
            //deleted
            pubsub.publish('post',{post:{mutation:'DELETED',data:originalPost}})
        }
        else if(!originalPost.published && post.published){
            //create
            pubsub.publish('post',{post:{mutation:'CREATED',data:post}})
        }
        else if(!originalPost.published){
            pubsub.publish('post',{post:{mutation:'UPDATED',data:post}})
        }
        else if(post.published){
            //update
            pubsub.publish('post',{post:{mutation:'UPDATED',data:post}})
        }
        return post

    },

    deletePost: (root, args, { db: { posts,comments } ,pubsub}, info) => {
        const postIndex = posts.findIndex(post => post.id === args.id);
        if (postIndex === -1) throw new Error('No such post to delete.');
        comments = comments.filter(c => c.post !== args.id);
        const [post] = posts.splice(postIndex, 1)
        if(post.published) pubsub.publish('post',{post:{mutation:'DELETED',data:post}})
        return post;
    },
    createComment: (root, args, context, info) => {
        // const { content, post, author } = args;
        const { db: { comments,users,posts },pubsub } = context
        const userExists = users.some(user => user.id === args.data.author);
        const postExists = posts.some(post => post.id === args.data.post);

        if (!userExists) throw new Error(`User doesn't exist`);
        if (!postExists) throw new Error(`Post doesn't exist`);

        const comment = {
            ...args.data,
            id: Math.random().toString().substr(3, 3),
        };
        comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`,{comment:{mutation:'CREATED',data:comment}})
        return comment;
    },
    deleteComment:(root,args,context,info)=>{
        const {id}=args;
        const {db:{comments},pubsub}=context

        const commentI=comments.findIndex(c=>c.id===id)
        const [comment]= (commentI===-1)?new Error('No Comment found..'):comments.splice(commentI,1)

        pubsub.publish(`comment ${comment.post}`,{comment:{mutation:'DELETE',data:comment}})
        return comment;
    },
    updateComment:(root,args,context,info)=>{
        const {id,data:{content}} = args
        const {db:{comments},pubsub} = context
        const comment = comments.find(c=>c.id===id) || new Error('No comment found')

        if(typeof content==='string'){comment.content=content}
        pubsub.publish(`comment ${comment.post}`,{comment:{mutation:'UPDATE',data:comment}})
        return comment;
    }
}

export { Mutation as default }