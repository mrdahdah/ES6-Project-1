// Simulated live API using EventTarget
export const LiveAPI = new EventTarget();

let counter = 0;
function randomPost() {
  counter++;
  return {
    id: `lp-${Date.now()}-${counter}`,
    user: ['Pat', 'Riley', 'Sam'][Math.floor(Math.random()*3)],
    text: ['Live update: new job!', 'Hot take: functional JS > OOP?', 'Shared a link to a great article.'][Math.floor(Math.random()*3)],
    timestamp: Date.now(),
    likes: 0,
    comments: [],
    type: 'text'
  };
}

let _intervalId = null;
export function startLive(intervalMs = 12000) {
  stopLive();
  _intervalId = setInterval(() => {
    const p = randomPost();
    LiveAPI.dispatchEvent(new CustomEvent('new-post', { detail: p }));
  }, intervalMs);
  return _intervalId;
}
export function stopLive(){ if (_intervalId) clearInterval(_intervalId); _intervalId = null; }
export function sendLiveNow(post){ const p = post || randomPost(); LiveAPI.dispatchEvent(new CustomEvent('new-post',{detail:p})); return p; }
