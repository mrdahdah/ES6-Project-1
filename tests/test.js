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

  // set account and test add
  app.setAccount('Tester');
  const id = 't-' + Date.now();
  app.addPost({ id, user: 'Tester', text: 'hello test', timestamp: Date.now(), likes:0, comments:[], type:'text' });
  assert(container.querySelector(`[data-id="${id}"]`) !== null, 'Post was added and rendered');

  // test like toggle
  app.likePost(id);
  let p = app.state.find(p=>p.id===id)||{};
  assert(p.likes === 1 && p.likedBy.includes('Tester'), 'Like recorded for Tester');
  app.likePost(id);
  p = app.state.find(p=>p.id===id)||{};
  assert(p.likes === 0 && !p.likedBy.includes('Tester'), 'Like toggled off');

  // test comment (correct user)
  app.commentPost(id, 'nice');
  const comments = (app.state.find(p=>p.id===id)||{}).comments || [];
  assert(comments.length === 1 && comments[0].text === 'nice' && comments[0].user === 'Tester', 'Comment added with correct user');

  // test edit
  app.editPost(id, { text: 'updated' });
  assert((app.state.find(p=>p.id===id)||{}).text === 'updated', 'Edit updated post');

  // test save (bookmark)
  app.toggleSave(id);
  assert((app.state.find(p=>p.id===id)||{}).saved === true, 'Post saved');

  // test reaction toggle
  app.toggleReaction(id, 'like');
  let r = (app.state.find(p=>p.id===id)||{}).reactions || {};
  assert(r.like && r.like.includes('Tester'), 'Reaction added');
  app.toggleReaction(id, 'like');
  r = (app.state.find(p=>p.id===id)||{}).reactions || {};
  assert(!r.like || !r.like.includes('Tester'), 'Reaction toggled off');

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

  // test notification permission toggle (simulated)
  // (manual verification recommended)

})();