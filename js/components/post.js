import { initials } from '../utils.js';

export function makePostElement(post, { currentUser, onLike, onComment, onEdit, onDelete, onSave, onReact } = {}){
  const article = document.createElement('article');
  article.className = 'post p-4 bg-white rounded-lg shadow';
  article.dataset.id = post.id;

  const liked = (post.likedBy||[]).includes(currentUser);
  const likeClass = liked ? 'btn btn-sm btn-primary like-btn' : 'btn btn-sm btn-ghost like-btn';
  const saveLabel = post.saved ? 'Saved' : 'Save';

  const reactionHTML = renderReactions(post);

  article.innerHTML = `
    <div class="meta flex items-start gap-3">
      <div class="avatar w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center font-semibold text-white cursor-pointer" role="button" tabindex="0">${escapeHTML(initials(post.user))}</div>
      <div class="flex-1">
        <div class="username font-semibold">${escapeHTML(post.user)}</div>
        <div class="time text-sm text-slate-500">${escapeHTML(postTime(post.timestamp))}</div>
      </div>
    </div>
    <div class="content mt-3">${renderContent(post)}</div>
    <div class="actions mt-3 flex gap-2 items-center">
      <button class="${likeClass}">Like <span class="ml-2 like-count">${post.likes||0}</span></button>
      <div class="reaction-bar ml-2">${reactionHTML}</div>
      <button class="btn btn-sm btn-ghost comment-toggle">Comment</button>
      <button class="btn btn-sm btn-ghost edit-btn">Edit</button>
      <button class="btn btn-sm btn-ghost delete-btn">Delete</button>
      <button class="btn btn-sm btn-outline save-btn ml-auto">${saveLabel}</button>
    </div>
    <div class="comments mt-3" hidden></div>
  `;

  // wire avatar click for profile
  const avatarEl = article.querySelector('.avatar');
  avatarEl.addEventListener('click', ()=>{
    import('../profile.js').then(mod => {
      const posts = (window.App && window.App.state) ? window.App.state.filter(pp => pp.user === post.user) : [];
      mod.showProfile(post.user, '', posts);
    });
  });

  const likeBtn = article.querySelector('.like-btn');
  const commentToggle = article.querySelector('.comment-toggle');
  const commentsEl = article.querySelector('.comments');
  const editBtn = article.querySelector('.edit-btn');
  const deleteBtn = article.querySelector('.delete-btn');
  const saveBtn = article.querySelector('.save-btn');
  const reactionBar = article.querySelector('.reaction-bar');

  likeBtn.addEventListener('click', () => onLike && onLike(post.id));
  commentToggle.addEventListener('click', () => {
    commentsEl.hidden = !commentsEl.hidden;
    if (!commentsEl.innerHTML) renderComments();
  });

  reactionBar && reactionBar.addEventListener('click', (e) => {
    const t = e.target.closest('[data-reaction]');
    if (!t) return;
    const type = t.dataset.reaction;
    onReact && onReact(post.id, type);
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Delete this post?')){ onDelete && onDelete(post.id); }
  });

  editBtn.addEventListener('click', () => { startEdit(); });
  saveBtn.addEventListener('click', () => { onSave && onSave(post.id); });

  function startEdit(){
    const contentNode = article.querySelector('.content');
    const editor = document.createElement('div');
    editor.className = 'edit-area-wrap';

    if (post.type === 'image' || post.type === 'link'){
      editor.innerHTML = `<input class='edit-input input input-sm input-bordered w-full' value='${escapeAttr(post.url||'')}' placeholder='URL' />
        <div class='edit-actions mt-2 flex gap-2'><button class='btn btn-sm save'>Save</button><button class='btn btn-sm btn-ghost cancel'>Cancel</button></div>`;
    } else {
      editor.innerHTML = `<textarea class='edit-input textarea textarea-bordered w-full'>${escapeHTML(post.text||'')}</textarea>
        <div class='edit-actions mt-2 flex gap-2'><button class='btn btn-sm save'>Save</button><button class='btn btn-sm btn-ghost cancel'>Cancel</button></div>`;
    }

    contentNode.replaceWith(editor);

    editor.querySelector('.cancel').addEventListener('click', () => refresh());
    editor.querySelector('.save').addEventListener('click', () => {
      const val = editor.querySelector('.edit-input').value.trim();
      if (post.type === 'image' || post.type === 'link'){
        onEdit && onEdit(post.id, { url: val });
      } else {
        onEdit && onEdit(post.id, { text: val });
      }
    });
  }

  function renderComments(){
    const list = document.createElement('div');
    if (post.comments && post.comments.length) {
      post.comments.forEach(c => {
        const cnode = document.createElement('div');
        cnode.className = 'comment p-2 rounded bg-slate-50';
        cnode.textContent = `${c.user}: ${c.text}`;
        list.appendChild(cnode);
      });
    }
    const add = document.createElement('div');
    add.className = 'comment-input flex gap-2 mt-2';
    add.innerHTML = `<input placeholder='Write a comment...' class='input input-sm input-bordered flex-1' /><button class='btn btn-sm add-comment'>Send</button>`;
    add.querySelector('.add-comment').addEventListener('click', () => {
      const input = add.querySelector('input');
      if (input.value.trim()){
        onComment && onComment(post.id, input.value.trim());
        input.value = '';
        refreshComments();
      }
    });
    commentsEl.innerHTML = '';
    commentsEl.appendChild(list);
    commentsEl.appendChild(add);
  }

  function refreshComments(){
    if (!commentsEl.hidden){ renderComments(); }
    article.querySelector('.like-count').textContent = post.likes || 0;
    // update like button state
    const likedNow = (post.likedBy||[]).includes(currentUser);
    if (likedNow) { likeBtn.classList.remove('btn-ghost'); likeBtn.classList.add('btn-primary'); }
    if (!likedNow) { likeBtn.classList.remove('btn-primary'); likeBtn.classList.add('btn-ghost'); }
    // update save label
    saveBtn.textContent = post.saved ? 'Saved' : 'Save';
    // update reaction bar (counts)
    const rb = article.querySelector('.reaction-bar');
    if (rb) rb.innerHTML = renderReactions(post);
    // re-render content area if url changed
    const content = article.querySelector('.content');
    if (content) content.innerHTML = renderContent(post);
  }

  function refresh(){
    const newNode = document.createElement('div');
    newNode.className = 'content';
    newNode.innerHTML = renderContent(post);
    const existing = article.querySelector('.edit-area-wrap') || article.querySelector('.content');
    existing.replaceWith(newNode);
  }

  function renderContent(p){
    if (p.type === 'image' && p.url){
      return `<div class='post-text'>${escapeHTML(p.text||'')}</div><img class='post-image rounded-md mt-2' src='${escapeAttr(p.url)}' alt='' />`;
    }
    if (p.type === 'link' && p.url){
      return `<div class='post-text'>${escapeHTML(p.text||'')}</div><div class='post-link mt-2'><a class='text-blue-600 underline' href='${escapeAttr(p.url)}' target='_blank' rel='noopener'>${escapeHTML(p.url)}</a></div>`;
    }
    return `${escapeHTML(p.text||'')}`;
  }

  function renderReactions(p){
    const types = [{k:'like',e:'👍'},{k:'celebrate',e:'🎉'},{k:'love',e:'❤️'},{k:'support',e:'🤝'}];
    return types.map(t=>{
      const arr = (p.reactions&&p.reactions[t.k])? p.reactions[t.k] : [];
      const count = arr.length;
      const active = arr.includes(currentUser) ? 'text-primary' : 'text-slate-500';
      return `<button data-reaction='${t.k}' class='btn btn-xs btn-ghost ${active}'>${t.e} <span class='ml-1 text-xs'>${count||''}</span></button>`;
    }).join('');
  }

  // helpers
  function postTime(ts){
    const s = Math.floor((Date.now()-ts)/1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s/60); if (m < 60) return `${m}m`;
    const h = Math.floor(m/60); if (h < 24) return `${h}h`;
    const d = Math.floor(h/24); return `${d}d`;
  }
  function escapeHTML(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }
  function escapeAttr(str){ return String(str||'').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }

  return article;
} 
