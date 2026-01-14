import FeedApp from '../js/feed.js';
import { sendLiveNow } from '../js/api.js';

const out = document.getElementById('out');
function assert(cond, msg){ out.textContent += (cond? 'PASS: ':'FAIL: ') + msg + '\n'; }

(async function run(){
  // minimal environment: build a container and attach
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = new FeedApp(container);
  app.init();

  // test add
  const id = 't-' + Date.now();
  app.addPost({ id, user: 'Tester', text: 'hello test', timestamp: Date.now(), likes:0, comments:[], type:'text' });
  assert(container.querySelector(`[data-id="${id}"]`) !== null, 'Post was added and rendered');

  // test like
  app.likePost(id);
  const likes = (app.state.find(p=>p.id===id)||{}).likes;
  assert(likes === 1, 'Like incremented');

  // test comment
  app.commentPost(id, 'nice');
  const comments = (app.state.find(p=>p.id===id)||{}).comments || [];
  assert(comments.length === 1 && comments[0].text === 'nice', 'Comment added');

  // test edit
  app.editPost(id, { text: 'updated' });
  assert((app.state.find(p=>p.id===id)||{}).text === 'updated', 'Edit updated post');

  // test delete + undo
  app.deletePost(id);
  assert(!app.state.find(p=>p.id===id), 'Post deleted');
  app.undoDelete();
  assert(app.state.find(p=>p.id===id), 'Undo restored post');

  // test live send
  sendLiveNow({ id: 'live-test', user: 'Live', text: 'live', timestamp: Date.now(), likes:0, comments:[], type:'text' });
  setTimeout(()=>{
    assert(container.querySelector('[data-id="live-test"]'), 'Live post received');
    out.textContent += '\nAll tests finished.';
  }, 200);
})();