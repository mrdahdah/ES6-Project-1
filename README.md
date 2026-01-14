# ES6 Smart Activity Feed

A small, front-end only activity feed (LinkedIn style) built with ES6 modules and DOM manipulation. Features:

- Likes (toggle with per-user tracking) 
- Comments (add & view)
- Edit and delete posts (with Undo)
- Rich post types: image & link
- Activity panel (All / Likes / Comments) per account
- Bookmarks (save posts)
- Reactions (multiple types: 👍 🎉 ❤️ 🤝)
- Toast notifications with actions (Undo)
- Drag-and-drop and File attach for images
- Dark mode toggle (Tailwind's dark class toggle)
- Live updates (simulated) and manual live trigger
- Filtering & search
- Local persistence via localStorage
- Tailwind CSS + DaisyUI for improved LinkedIn-like styling
- PWA offline caching and local notifications for live updates (Service Worker + Notification API)

Added test pages in `tests/` and `mock-live.html` to simulate and verify live updates.

CI & Tests:
- Playwright end-to-end tests in `tests/e2e.spec.js`
- GitHub Actions workflow in `.github/workflows/playwright.yml` runs tests on push/PR

Notes:
- Playwright tests assume a server at http://localhost:8080 - in CI the workflow starts a server.
- Push notifications in production require a server for Push API/VAPID; here we use the Notification API (user-granted) to show local notifications for live posts.
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
