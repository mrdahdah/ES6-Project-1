const queue = [];
let running = false;
export function showToast(message, { duration = 4000, actionLabel, action } = {}){
  const container = document.getElementById('toasts');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<div class="message">${message}</div>`;
  if (actionLabel){
    const actions = document.createElement('div');
    actions.className = 'actions';
    const aBtn = document.createElement('button');
    aBtn.className = 'btn btn-sm btn-outline';
    aBtn.textContent = actionLabel;
    aBtn.addEventListener('click', ()=>{ try{ action && action(); } finally { close(); } });
    actions.appendChild(aBtn);
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-sm btn-ghost';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', close);
    actions.appendChild(closeBtn);
    el.appendChild(actions);
  }

  function close(){
    el.classList.remove('show');
    el.addEventListener('transitionend', ()=>{ if (el.parentNode) el.parentNode.removeChild(el); }, { once:true });
  }

  container.appendChild(el);
  // allow CSS transition
  requestAnimationFrame(()=> el.classList.add('show'));

  if (!actionLabel && duration) setTimeout(close, duration);
  return { close };
}