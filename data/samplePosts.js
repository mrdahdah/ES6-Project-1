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
  },
  {
    id: 'p3',
    user: 'Design Bot',
    text: 'A neat mockup I made',
    timestamp: Date.now() - 1000 * 60 * 5,
    likes: 1,
    comments: [],
    type: 'image',
    url: 'https://picsum.photos/seed/design/600/300'
  },
  {
    id: 'p4',
    user: 'Sam',
    text: 'Checkout this article',
    timestamp: Date.now() - 1000 * 60 * 3,
    likes: 0,
    comments: [],
    type: 'link',
    url: 'https://example.com'
  }
];