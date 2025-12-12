# Project Prototype 3 — Status Report
SCREENSHOTS:
![Home page](<Images/Home page.png>)
![Project page light mode](<Images/Project Light.png>)
![Tools Page](<Images/Tools Dark.png>)
## 1) Features implemented so far

1. **Dynamic greeting and live clock on the home page**  
   Uses core JavaScript concepts taught in class, including variables, conditionals, functions, and DOM manipulation to update page content based on the current time.

2. **Projects section rendered dynamically from a local JSON file**  
   Uses `fetch()` to load and parse JSON data, loops through objects and arrays, and dynamically creates and inserts HTML elements into the page.

3. **Interactive project filter menu**  
   Uses event listeners, conditional logic, array filtering, and jQuery-based animations to update displayed content based on user interaction.

4. **Light/Dark theme switcher with saved preference**  
   Uses DOM manipulation, event handling, and the browser’s `localStorage` API to persist user preferences across page reloads.

5. **Sleep and coffee calculator tool**  
   Demonstrates basic JavaScript operations taught in class, including arithmetic, conditionals, functions, form handling, and dynamic output rendering.

6. **External API integration (Earth facts)**  
   Uses asynchronous JavaScript (`fetch`, `async/await`) to retrieve data from a public web API, handle loading and error states, and display results dynamically.

7. **jQuery-based animations and UI effects**  
   Uses jQuery selectors, chaining, and animation methods to enhance UI interactions across multiple sections of the site.

8. **Contact form with validation and feedback**  
   Uses form events, input handling, validation logic, DOM updates, and browser storage to generate and restore user input and provide live feedback.

9. **SVG-based animation**  
   Uses JavaScript to animate SVG elements, demonstrating more advanced front-end interaction techniques covered later in the course.

10. **Responsive and accessible layout**  
    Uses semantic HTML, responsive CSS, and accessibility-friendly patterns (ARIA live regions, readable contrast, keyboard-friendly controls).

---

## 2) Features still planned

1. **About Me section**  
   Add a dedicated section introducing myself, my background, and interests to make the site more personal and cohesive.

2. **Photography section**  
   Add a photography gallery section to showcase creative work and expand the site beyond purely technical content.

3. **More cohesive visual styling**  
   Perform a final design pass to improve consistency in spacing, typography, and layout across all pages.

4. **Spotify API insights**  
   Extend the current Spotify embed by adding API-based insights (such as top artists or recently played tracks) to demonstrate deeper API integration.

---

## 3) Issues encountered and status

1. **CORS restrictions when using APIs**  
   Some external APIs cannot be accessed directly from the browser due to CORS restrictions. The currently used Earth facts API works, but switching to other APIs may require finding CORS-enabled endpoints or using a proxy.  
   **Status:** Partially resolved / dependent on API.

2. **Local JSON fetching requires a local server**  
   Fetching local JSON files does not work when opening HTML files directly due to browser security rules. This is resolved by running the project using Live Server or another local web server.  
   **Status:** Resolved.

3. **Spotify API authentication complexity**  
   Accessing Spotify user data requires OAuth authentication and token handling, which is more complex in a frontend-only project and may require additional setup.  
   **Status:** Planned.
