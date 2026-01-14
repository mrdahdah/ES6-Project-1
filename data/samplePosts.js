export const SAMPLE_POSTS = [
  {
    id: 'p1',
    user: 'Alice Johnson',
    text: 'Just finished a small side project using vanilla JS — so satisfying! 💡',
    timestamp: Date.now() - 1000 * 60 * 60,
    likes: 3,
    comments: [
      { id: 'c1', user: 'Ben', text: 'Nice work!' }
    ],
    type: 'text'
  },
  {
    id: 'p2',
    user: 'Charles Kim',
    text: 'Sharing a quick UI tip: use CSS variables to manage theme colors.',
    timestamp: Date.now() - 1000 * 60 * 10,
    likes: 2,
    comments: [],
    type: 'text'
  }
];