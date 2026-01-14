# ES6 Smart Activity Feed

A small, front-end only activity feed (LinkedIn style) built with ES6 modules and DOM manipulation. Features:

- Likes
- Comments
- Live updates (simulated)
- Filtering & search
- Local persistence via localStorage

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
This project is intentionally simple so you can practice ES6 and DOM manipulation. Ideas to extend:
- Add editing/deleting posts
- Use WebSockets for real live updates
- Add user profiles and avatars

Enjoy! — Practice building features and experimenting with the code.
