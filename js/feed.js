import { SAMPLE_POSTS } from '../data/samplePosts.js';
import { makePostElement } from './components/post.js';
import { LiveAPI } from './api.js';
import { uid } from './utils.js';

export default class FeedApp {
  constructor(container){
    this.container = container;
    this.state = [];
    this.filter = 'all';
    this.search = '';
    this._lastDeleted = null;

    LiveAPI.addEventListener('new-post', e => this.addPost(e.detail, true));
  }

  init(){
    // seed
    this.state = JSON.parse(localStorage.getItem('feed-state')) || SAMPLE_POSTS.slice();
    this.render();
  }

  save(){ localStorage.setItem('feed-state', JSON.stringify(this.state)); }

  addPost(post, isLive=false){
    this.state.unshift(post);
    this.save();
    this.render();
    if (isLive){
      const el = this.container.querySelector('[data-id]');
      el && el.classList.add('live');
      setTimeout(()=> el && el.classList.remove('live'), 2000);
      this.showMessage('New live update received', 2500);
    }
  }

  likePost(id){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    p.likes = (p.likes||0) + 1;
    this.save(); this.render();
  }

  commentPost(id, text){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    p.comments = p.comments||[];
    p.comments.push({ id: uid('c-'), user: 'You', text });
    this.save(); this.render();
  }

  editPost(id, data){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    Object.assign(p, data);
    this.save(); this.render();
    this.showMessage('Post updated', 2000);
  }

  deletePost(id){
    const idx = this.state.findIndex(x=>x.id===id); if (idx === -1) return;
    const [removed] = this.state.splice(idx,1);
    this._lastDeleted = { post: removed, index: idx };
    this.save(); this.render();
    this.showMessage('Post deleted — <a href="#" id="undo">Undo</a>', 5000);
    // attach undo handler
    setTimeout(()=>{ if (this._lastDeleted) this._lastDeleted = null; }, 5500);
    // event delegation for undo link
    const undoLink = document.getElementById('undo');
    if (undoLink){ undoLink.addEventListener('click', (e)=>{ e.preventDefault(); this.undoDelete(); }); }
  }

  undoDelete(){
    if (!this._lastDeleted) return;
    this.state.splice(this._lastDeleted.index, 0, this._lastDeleted.post);
    this._lastDeleted = null;
    this.save(); this.render();
    this.showMessage('Delete undone', 2000);
  }

  setFilter(f){ this.filter = f; this.render(); }
  setSearch(s){ this.search = s; this.render(); }

  showMessage(msg, t=2000){
    const status = document.getElementById('status');
    if (!status) return;
    status.innerHTML = msg;
    if (t) setTimeout(()=>{ status.innerHTML = 'Live: connected'; }, t);
  }

  render(){
    const list = document.createDocumentFragment();
    const filtered = this.state.filter(p => {
      if (this.filter !== 'all' && p.type !== this.filter) return false;
      if (this.search && !(p.text||'').toLowerCase().includes(this.search.toLowerCase())) return false;
      return true;
    });

    if (filtered.length === 0){
      const e = document.createElement('div');
      e.className = 'post';
      e.innerHTML = '<div class="small">No posts yet — create one!</div>';
      list.appendChild(e);
    } else {
      filtered.forEach(p => {
        const node = makePostElement(p, {
          onLike: (id) => this.likePost(id),
          onComment: (id, text) => this.commentPost(id, text),
          onEdit: (id, data) => this.editPost(id, data),
          onDelete: (id) => this.deletePost(id)
        });
        list.appendChild(node);
      });
    }

    this.container.innerHTML = '';
    this.container.appendChild(list);
  }
} 
