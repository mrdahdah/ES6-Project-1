import { SAMPLE_POSTS } from '../data/samplePosts.js';
import { makePostElement } from './components/post.js';
import { LiveAPI } from './api.js';
import { showToast } from './toast.js';
import { uid } from './utils.js';

export default class FeedApp {
  constructor(container){
    this.container = container;
    this.state = [];
    this.filter = 'all';
    this.search = '';
    this._lastDeleted = null;
    this.currentAccount = 'You';
    this.activityPanel = null;

    LiveAPI.addEventListener('new-post', e => this.addPost(e.detail, true));
  }

  init(){
    // seed
    this.state = JSON.parse(localStorage.getItem('feed-state')) || SAMPLE_POSTS.slice();
    // normalize fields
    this.state.forEach(p => { 
      p.likedBy = p.likedBy || []; 
      p.saved = !!p.saved;
      p.reactions = p.reactions || {};
    });
    this.render();
  }

  save(){ localStorage.setItem('feed-state', JSON.stringify(this.state)); }

  addPost(post, isLive=false){
    post.likedBy = post.likedBy || [];
    post.saved = !!post.saved;
    post.reactions = post.reactions || {};
    this.state.unshift(post);
    this.save();
    this.render();
    if (isLive){
      const el = this.container.querySelector('[data-id]');
      el && el.classList.add('live');
      setTimeout(()=> el && el.classList.remove('live'), 2000);
      this.showMessage('New live update received', 2500);
      // show native notification when permission is granted
      try{
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted'){
          new Notification(`New post from ${post.user}`, { body: (post.text||'').slice(0,120) });
        }
      }catch(e){}
    }
  }

  likePost(id){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    const user = this.currentAccount || 'You';
    p.likedBy = p.likedBy || [];
    const idx = p.likedBy.indexOf(user);
    if (idx === -1) p.likedBy.push(user);
    else p.likedBy.splice(idx,1);
    p.likes = (p.likedBy || []).length;
    this.save(); this.render();
  }

  commentPost(id, text){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    p.comments = p.comments||[];
    p.comments.push({ id: uid('c-'), user: this.currentAccount || 'You', text });
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
    // show toast with undo
    showToast('Post deleted', { actionLabel: 'Undo', action: () => this.undoDelete(), duration: 6000 });
    setTimeout(()=>{ if (this._lastDeleted) this._lastDeleted = null; }, 6500);
  }

  undoDelete(){
    if (!this._lastDeleted) return;
    this.state.splice(this._lastDeleted.index, 0, this._lastDeleted.post);
    this._lastDeleted = null;
    this.save(); this.render();
    this.showMessage('Delete undone', 2000);
  }

  toggleSave(id){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    p.saved = !p.saved;
    this.save(); this.render();
    this.showMessage(p.saved ? 'Saved post' : 'Removed saved', 1500);
  }

  toggleReaction(id, type){
    const p = this.state.find(x=>x.id===id); if (!p) return;
    p.reactions = p.reactions || {};
    p.reactions[type] = p.reactions[type] || [];
    const user = this.currentAccount || 'You';
    const idx = p.reactions[type].indexOf(user);
    if (idx === -1) p.reactions[type].push(user);
    else p.reactions[type].splice(idx,1);
    this.save(); this.render();
  }

  setAccount(name){ this.currentAccount = name; this.showMessage(`${name} active`, 1500); this.render(); }

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
          currentUser: this.currentAccount,
          onLike: (id) => this.likePost(id),
          onComment: (id, text) => this.commentPost(id, text),
          onEdit: (id, data) => this.editPost(id, data),
          onDelete: (id) => this.deletePost(id),
          onSave: (id) => this.toggleSave(id),
          onReact: (id, type) => this.toggleReaction(id, type)
        });
        list.appendChild(node);
      });
    }

    this.container.innerHTML = '';
    this.container.appendChild(list);

    if (this.activityPanel){ this.activityPanel.render(this.state, this.currentAccount); }
  }

} 
