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

  setFilter(f){ this.filter = f; this.render(); }
  setSearch(s){ this.search = s; this.render(); }

  render(){
    const list = document.createDocumentFragment();
    const filtered = this.state.filter(p => {
      if (this.filter !== 'all' && p.type !== this.filter) return false;
      if (this.search && !(p.text||'').toLowerCase().includes(this.search.toLowerCase())) return false;
      return true;
    });

    filtered.forEach(p => {
      const node = makePostElement(p, {
        onLike: (id) => this.likePost(id),
        onComment: (id, text) => this.commentPost(id, text)
      });
      list.appendChild(node);
    });

    this.container.innerHTML = '';
    this.container.appendChild(list);
  }
}
