export function makePostElement(post, { onLike, onComment, onEdit, onDelete } = {}){
  const article = document.createElement('article');
  article.className = 'post';
  article.dataset.id = post.id;

  article.innerHTML = `
    <div class="meta">
      <div class="avatar" aria-hidden="true"></div>
      <div>
        <div class="username">${escapeHTML(post.user)}</div>
        <div class="time small">${escapeHTML(postTime(post.timestamp))}</div>
      </div>
    </div>
    <div class="content">${renderContent(post)}</div>
    <div class="actions">
      <button class="button like-btn">Like <span class="like-count">${post.likes}</span></button>
      <button class="button comment-toggle">Comment</button>
      <button class="button edit-btn">Edit</button>
      <button class="button delete-btn">Delete</button>
    </div>
    <div class="comments" hidden></div>
  `;

  const likeBtn = article.querySelector('.like-btn');
  const commentToggle = article.querySelector('.comment-toggle');
  const commentsEl = article.querySelector('.comments');
  const editBtn = article.querySelector('.edit-btn');
  const deleteBtn = article.querySelector('.delete-btn');

  likeBtn.addEventListener('click', () => onLike && onLike(post.id));
  commentToggle.addEventListener('click', () => {
    commentsEl.hidden = !commentsEl.hidden;
    if (!commentsEl.innerHTML) renderComments();
  });

  deleteBtn.addEventListener('click', () => {
    if (confirm('Delete this post?')){ onDelete && onDelete(post.id); }
  });

  editBtn.addEventListener('click', () => {
    startEdit();
  });

  function startEdit(){
    const contentNode = article.querySelector('.content');
    const editor = document.createElement('div');
    editor.className = 'edit-area-wrap';

    if (post.type === 'image' || post.type === 'link'){
      editor.innerHTML = `<input class='edit-input' value='${escapeAttr(post.url||'')}' placeholder='URL' />
        <div class='edit-actions'><button class='button save'>Save</button><button class='button cancel'>Cancel</button></div>`;
    } else {
      editor.innerHTML = `<textarea class='edit-input'>${escapeHTML(post.text||'')}</textarea>
        <div class='edit-actions'><button class='button save'>Save</button><button class='button cancel'>Cancel</button></div>`;
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
        cnode.className = 'comment';
        cnode.textContent = `${c.user}: ${c.text}`;
        list.appendChild(cnode);
      });
    }
    const add = document.createElement('div');
    add.className = 'comment-input';
    add.innerHTML = `<input placeholder='Write a comment...' /><button class='button add-comment'>Send</button>`;
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
    article.querySelector('.like-count').textContent = post.likes;
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
      return `<div class='post-text'>${escapeHTML(p.text||'')}</div><img class='post-image' src='${escapeAttr(p.url)}' alt='' />`;
    }
    if (p.type === 'link' && p.url){
      return `<div class='post-text'>${escapeHTML(p.text||'')}</div><div class='post-link'><a href='${escapeAttr(p.url)}' target='_blank' rel='noopener'>${escapeHTML(p.url)}</a></div>`;
    }
    return `${escapeHTML(p.text||'')}`;
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
