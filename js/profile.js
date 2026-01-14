import { avatarUrl } from './utils.js';

export function showProfile(name, email, posts = []){
  const root = document.getElementById('profile-modal-root');
  if (!root) return;
  root.innerHTML = '';

  const backdrop = document.createElement('div');
  backdrop.className = 'profile-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'profile-modal';

  const img = document.createElement('img');
  img.className = 'avatar rounded-full';
  img.src = avatarUrl(name, email);
  img.alt = name;

  const head = document.createElement('div');
  head.className = 'flex items-center gap-3';
  const txt = document.createElement('div');
  txt.innerHTML = `<div class='font-semibold text-lg'>${escapeHTML(name)}</div><div class='text-sm text-slate-500'>${escapeHTML(email||'')}</div>`;
  const close = document.createElement('button'); close.className = 'btn btn-sm btn-ghost close-btn'; close.textContent = 'Close';
  close.addEventListener('click', closeModal);

  head.appendChild(img); head.appendChild(txt); head.appendChild(close);
  modal.appendChild(head);

  const recent = document.createElement('div'); recent.className = 'recent';
  if (posts && posts.length){
    posts.slice(0,6).forEach(p=>{
      const el = document.createElement('div'); el.className = 'py-2 border-b last:border-b-0';
      el.innerHTML = `<div class='text-sm font-semibold'>${escapeHTML(p.text||'(media)')}</div><div class='text-xs text-slate-400'>${timeAgo(p.timestamp)}</div>`;
      recent.appendChild(el);
    });
  } else { recent.innerHTML = '<div class="text-slate-500">No recent posts</div>'; }
  modal.appendChild(recent);

  backdrop.appendChild(modal);
  root.appendChild(backdrop);
  root.setAttribute('aria-hidden', 'false');

  // close when clicking outside
  backdrop.addEventListener('click', (e)=>{ if (e.target === backdrop) closeModal(); });

  function closeModal(){ root.innerHTML=''; root.setAttribute('aria-hidden','true'); }
}

function timeAgo(ts){ const s = Math.floor((Date.now()-ts)/1000); if (s<60) return `${s}s`; const m = Math.floor(s/60); if (m<60) return `${m}m`; const h = Math.floor(m/60); if (h<24) return `${h}h`; return `${Math.floor(h/24)}d`; }
function escapeHTML(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }