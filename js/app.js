import FeedApp from './feed.js';
import { startLive, sendLiveNow } from './api.js';

const feedContainer = document.getElementById('feed');
const app = new FeedApp(feedContainer);
app.init();
startLive();

// composer
const postBtn = document.getElementById('post-btn');
const newText = document.getElementById('new-text');
const postType = document.getElementById('post-type');
const extraUrl = document.getElementById('extra-url');
const account = document.getElementById('account');

postBtn.addEventListener('click', () => {
  const text = newText.value.trim();
  const type = postType.value;
  const url = extraUrl.value.trim();
  if (!text && type === 'text') return;

  const post = { id: `p-${Date.now()}`, user: account.value || 'You', text: text || '', timestamp: Date.now(), likes:0, comments:[], type };
  if (type === 'image' || type === 'link') post.url = url;

  app.addPost(post);
  newText.value = '';
  extraUrl.value = '';
});

// send a manual live post for testing
const sendLiveBtn = document.getElementById('send-live');
sendLiveBtn.addEventListener('click', () => sendLiveNow({ id: `man-${Date.now()}`, user: account.value || 'You', text: 'Manual live post', timestamp: Date.now(), likes:0, comments:[], type: 'text' }));

// filtering & search
const filter = document.getElementById('filter');
filter.addEventListener('change', e => app.setFilter(e.target.value));
const search = document.getElementById('search');
let sTimer;
search.addEventListener('input', e => {
  clearTimeout(sTimer); sTimer = setTimeout(()=> app.setSearch(e.target.value), 200);
});
