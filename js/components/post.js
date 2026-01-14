export function makePostElement(post, { onLike, onComment } = {}){
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
    <div class="content">${escapeHTML(post.text)}</div>
    <div class="actions">
      <button class="button like-btn">Like <span class="like-count">${post.likes}</span></button>
      <button class="button comment-toggle">Comment</button>
    </div>
    <div class="comments" hidden></div>
  `;

  const likeBtn = article.querySelector('.like-btn');
  const commentToggle = article.querySelector('.comment-toggle');
  const commentsEl = article.querySelector('.comments');

  likeBtn.addEventListener('click', () => onLike && onLike(post.id));
  commentToggle.addEventListener('click', () => {
    commentsEl.hidden = !commentsEl.hidden;
    if (!commentsEl.innerHTML) renderComments();
  });

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
    // small way to re-render comment list after update
    if (!commentsEl.hidden){ renderComments(); }
    article.querySelector('.like-count').textContent = post.likes;
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

  return article;
}
