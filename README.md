# Project Final Status Report

## 1) Features implemented

1. **Dynamic greeting and live clock on the home page**  
   Uses JavaScript variables, conditionals, functions, and DOM manipulation to generate a time-aware greeting and update a live clock in real time.  
   This demonstrates foundational JS concepts while adding a small layer of personalization to the UI.

2. **Projects section rendered dynamically from a local JSON file**  
   Uses `fetch()` with `async/await` to load and validate JSON, then dynamically creates and injects project cards into the DOM.  
   This separates content from presentation and makes the projects section easy to update or extend.

3. **Interactive project filter menu with animated transitions**  
   Uses event listeners, conditional logic, and array filtering to update visible projects by category.  
   jQuery-based animations are used to smoothly transition content instead of abruptly replacing it.

4. **Light/Dark theme switcher with persisted user preference**  
   Uses DOM manipulation and the browser’s `localStorage` API to save and restore the user’s preferred theme.  
   Theme styles are driven by CSS variables, making the design system easier to maintain and extend.

5. **Sleep and coffee calculator tool**  
   Uses form handling, arithmetic operations, conditionals, and functions to compute and display results dynamically.  
   Includes input validation and friendly error messaging to improve usability.

6. **External API integration (Earth facts)**  
   Uses asynchronous JavaScript (`fetch`, `async/await`) to retrieve data from a public API.  
   Implements loading and error states so users understand what’s happening during async operations.

7. **Contact form with validation, feedback, and draft generation**  
   Uses form events, validation logic, DOM updates, and `localStorage` to generate an email draft and restore user input on refresh.  
   Live character counting and feedback messages improve clarity and reduce user error.

8. **SVG-based animation on the home page**  
   Uses JavaScript and `requestAnimationFrame` to animate an SVG underline with easing.  
   This demonstrates more advanced front-end interaction techniques beyond basic DOM updates.

9. **About Me page with photography gallery**  
   Adds a dedicated About page introducing background, experience, and interests to make the site more cohesive and personal.  
   Includes a responsive photography gallery with descriptive alt text to showcase creative work alongside technical projects.

10. **Asynchronous and performance-aware media loading**  
    Images across the site, including the photography gallery, use lazy loading to reduce initial load cost.  
    This improves perceived performance and demonstrates awareness of real-world frontend optimization practices.

11. **Responsive and accessible layout patterns**  
    Uses semantic HTML, responsive CSS layouts, and accessibility-friendly patterns such as ARIA live regions and keyboard-accessible controls.  
    The layout adapts across screen sizes while maintaining readable contrast in both light and dark modes.

---

## 2) What went right

1. **Core JavaScript features remained stable due to modular, page-scoped scripts**  
   Each page only runs the JavaScript it needs by checking `body[data-page]`, reducing unintended side effects.  
   This made debugging easier as features were added incrementally.

2. **Theme system became predictable after early initialization**  
   Moving theme initialization into the `<head>` reduced visual “flashing” on page reload.  
   Centralizing theme values in CSS variables made UI updates faster and less error-prone.

3. **Nav and footer modularization significantly improved maintainability**  
   Injecting shared navigation and footer markup prevented repetitive edits across multiple pages.  
   This change became especially important once theme controls and page highlights were added.

4. **UI polish improved overall clarity and cohesion**  
   Spacing, typography, button styles, and card layouts were refined to feel more consistent across pages.  
   Small details like animated transitions and visual feedback made interactions feel more intentional.

5. **Async UI behavior felt clearer once loading and error states were added**  
   Users are no longer left guessing when content is loading or fails to appear.  
   This improved both usability and perceived reliability of the site.

---

## 3) Issues encountered and how they were handled

1. **Local JSON fetching requires a local server**  
   Browsers block `fetch()` requests to local files for security reasons when opening HTML directly.  
   **Resolution:** Run the project using Live Server or another local web server.  
   **Status:** Resolved and documented.

2. **Dark mode browser extensions interfered with visual testing**  
   Forced dark mode extensions sometimes override site colors, invert images, or alter gradients.  
   **Resolution:** Use explicit theme tokens with `html[data-theme="dark"]` and test in a clean browser profile.  
   **Status:** Mostly resolved (extensions may still override styles by design).

3. **Gradient banding and background artifacts**  
   Some browsers displayed subtle seams when stacking gradients directly on the `body`.  
   **Resolution:** Move background glows to a fixed `body::before` pseudo-element to improve compositing.  
   **Status:** Resolved.

4. **Image path and filename inconsistencies**  
   Images failed to load when folder names or capitalization didn’t match exactly.  
   **Resolution:** Standardize site assets under a single directory and ensure README paths match folder names.  
   **Status:** Resolved.

5. **Spotify API authentication complexity**  
   Accessing Spotify user data requires OAuth, token handling, and scopes, which is difficult to manage in a frontend-only prototype.  
   **Resolution:** Use a Spotify embed for presentation and demonstrate API usage with a CORS-friendly public API instead.  
   **Status:** Deferred due to scope.

---

## 4) Notes / How to run

- Open the project using **Live Server** (or another local web server) to enable JSON fetching.
- Theme preference is saved using **localStorage**.
- Visual appearance may differ if a forced dark mode browser extension is enabled.
