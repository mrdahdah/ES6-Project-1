import FeedApp from './feed.js';
import ActivityPanel from './activity.js';
import { startLive, sendLiveNow } from './api.js';
import { showToast } from './toast.js';

const feedContainer = document.getElementById('feed');
const activityEl = document.getElementById('activity-panel');
const app = new FeedApp(feedContainer);
app.activityPanel = new ActivityPanel(activityEl);
app.init();
// expose to window for profile lookups from components
window.App = app;
startLive();

// theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle){
  const update = ()=> themeToggle.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
  update();
  themeToggle.addEventListener('click', ()=>{ document.documentElement.classList.toggle('dark'); update(); });
}

// notifications
const notifyBtn = document.getElementById('notify-btn');
if (notifyBtn){
  notifyBtn.addEventListener('click', async ()=>{
    if (!('Notification' in window)) return alert('Notifications not supported');
    const p = await Notification.requestPermission();
    if (p === 'granted') showToast('Notifications enabled');
    else showToast('Notifications denied');
  });
}

// attach file handling
const attachBtn = document.getElementById('attach-btn');
const imageFile = document.getElementById('image-file');
const attachPreview = document.getElementById('attach-preview');
attachBtn.addEventListener('click', ()=> imageFile.click());
imageFile.addEventListener('change', (e)=>{
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    attachPreview.innerHTML = `<img src='${r.result}' alt='preview'/>`;
    // set composer url and type
    document.getElementById('extra-url').value = r.result;
    document.getElementById('post-type').value = 'image';
  };
  r.readAsDataURL(f);
});
// drag-drop attach
const composerArea = document.querySelector('.composer');
composerArea.addEventListener('dragover', (e)=>{ e.preventDefault(); composerArea.classList.add('border-primary'); });
composerArea.addEventListener('dragleave', ()=> composerArea.classList.remove('border-primary'));
composerArea.addEventListener('drop', (e)=>{
  e.preventDefault(); composerArea.classList.remove('border-primary');
  const f = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    attachPreview.innerHTML = `<img src='${r.result}' alt='preview'/>`;
    document.getElementById('extra-url').value = r.result;
    document.getElementById('post-type').value = 'image';
  };
  r.readAsDataURL(f);
});

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

// account change
account.addEventListener('change', e => app.setAccount(e.target.value));

// filtering & search
const filter = document.getElementById('filter');
filter.addEventListener('change', e => app.setFilter(e.target.value));
const search = document.getElementById('search');
let sTimer;
search.addEventListener('input', e => {
  clearTimeout(sTimer); sTimer = setTimeout(()=> app.setSearch(e.target.value), 200);
});
