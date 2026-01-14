export default class ActivityPanel {
  constructor(container){
    this.container = container;
    this.activeTab = 'all';
    this.currentUser = 'You';
    this.build();
  }

  build(){
    this.container.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Activity</h3>
        <div class="btn-group btn-group-sm" role="tablist">
          <button data-tab="all" class="btn btn-ghost btn-xs">All</button>
          <button data-tab="likes" class="btn btn-ghost btn-xs">Likes</button>
          <button data-tab="comments" class="btn btn-ghost btn-xs">Comments</button>
        </div>
      </div>
      <div id="activity-list" class="space-y-2 text-sm text-slate-700"></div>
    `;

    this.listEl = this.container.querySelector('#activity-list');
    this.container.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', e => {
      this.activeTab = e.target.dataset.tab; this.render(this._state, this.currentUser);
    }));
  }

  render(state = [], currentUser = 'You'){
    this._state = state;
    this.currentUser = currentUser;
    const activities = [];

    // posts authored by user
    state.forEach(p => {
      if (p.user === currentUser) activities.push({ type: 'post', ts: p.timestamp, text: `Posted: ${p.text||'(media)'}`, ref: p });
      if (p.likedBy && p.likedBy.includes(currentUser)) activities.push({ type: 'like', ts: p.timestamp, text: `Liked: ${p.user} — ${p.text||''}`, ref: p });
      if (p.comments) p.comments.forEach(c => { if (c.user === currentUser) activities.push({ type: 'comment', ts: p.timestamp, text: `Commented on ${p.user}: ${c.text}`, ref: p }); });
    });

    // filter by tab
    const filtered = activities.filter(a => {
      if (this.activeTab === 'all') return true;
      return a.type === this.activeTab;
    }).sort((a,b)=> b.ts - a.ts).slice(0,50);

    this.listEl.innerHTML = filtered.length ? filtered.map(a=>`<div class='p-2 rounded hover:bg-slate-50'>${escapeHTML(a.text)} <div class='text-xs text-slate-400'>${timeAgo(a.ts)}</div></div>`).join('') : '<div class="text-slate-500">No activity</div>';
  }
}

function timeAgo(ts){ const s = Math.floor((Date.now()-ts)/1000); if (s<60) return `${s}s`; const m = Math.floor(s/60); if (m<60) return `${m}m`; const h=Math.floor(m/60); if (h<24) return `${h}h`; return `${Math.floor(h/24)}d`; }
function escapeHTML(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }