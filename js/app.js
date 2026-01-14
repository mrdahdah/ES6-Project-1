import FeedApp from './feed.js';
import { startLive } from './api.js';

const feedContainer = document.getElementById('feed');
const app = new FeedApp(feedContainer);
app.init();
startLive();

// composer
const postBtn = document.getElementById('post-btn');
const newText = document.getElementById('new-text');
postBtn.addEventListener('click', () => {
  const text = newText.value.trim();
  if (!text) return;
  app.addPost({ id: `p-${Date.now()}`, user: 'You', text, timestamp: Date.now(), likes:0, comments:[], type:'text' });
  newText.value = '';
});

// filtering & search
const filter = document.getElementById('filter');
filter.addEventListener('change', e => app.setFilter(e.target.value));
const search = document.getElementById('search');
let sTimer;
search.addEventListener('input', e => {
  clearTimeout(sTimer); sTimer = setTimeout(()=> app.setSearch(e.target.value), 200);
});
