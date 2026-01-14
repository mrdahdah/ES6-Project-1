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

// Start emitting a new-post update every 12s
export function startLive() {
  setInterval(() => {
    const p = randomPost();
    LiveAPI.dispatchEvent(new CustomEvent('new-post', { detail: p }));
  }, 12000);
}
