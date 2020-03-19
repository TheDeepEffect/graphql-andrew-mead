//Demo data
const users = [
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

const posts = [
    {
        id: 'po$1' ,
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
        author:  '1',
    },
];
const comments = [
    { id: 'com$1', content: 'Worksss!!', author: '2', post: 'po$1' },
    { id: 'com$2', content: 'Delete Worksss!!', author: '1', post: 'po$2' },
];
const db = {
    users, posts, comments

}

export { db as default }