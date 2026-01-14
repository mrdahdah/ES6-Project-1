# ES6 Smart Activity Feed

A small, front-end only activity feed (LinkedIn style) built with ES6 modules and DOM manipulation. Features:

- Likes (toggle) 
- Comments (add & view)
- Edit and delete posts (with Undo)
- Rich post types: image & link
- Live updates (simulated) and manual live trigger
- Filtering & search
- Local persistence via localStorage

Added test pages in `tests/` and `mock-live.html` to simulate and verify live updates.
## Run
Modules need a server. From the project folder run one of these:

- `npx http-server -c-1` (recommended)
- `python -m http.server 8000`
- Use the VS Code "Live Server" extension

Open http://localhost:8080 (or port shown) and experiment.

## Files
- `index.html` - app shell
- `css/styles.css` - simple styles
- `js/app.js` - bootstraps app
- `js/feed.js` - feed state & rendering
- `js/components/post.js` - DOM for a single post
- `js/api.js` - simulated live API
- `data/samplePosts.js` - seed posts

## Notes & Next Steps
This project demonstrates a richer ES6 + DOM feed to practice real-world features. Ideas & implemented extensions:
- **Edit and delete posts** (with Undo)
- **Rich post types**: image & link
- Manual & simulated live updates (use `mock-live.html`)
- Account switcher for posting
- Improved LinkedIn-like styling
- Simple in-browser tests in `tests/` to verify core flows

Enjoy! — Practice building features and experimenting with the code.
