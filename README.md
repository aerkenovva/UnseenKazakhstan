# Unseen Kazakhstan — SE-2502 Final Project

A responsive multi-page front-end travel website about lesser-known destinations in Kazakhstan.

## Main features
- 9 connected HTML pages with responsive Bootstrap + custom CSS layouts
- Light/dark theme saved in `localStorage`
- Sign Up, Sign In and Profile authentication simulation with multiple local accounts
- JavaScript form validation with on-page error messages
- Search, filters, sorting, favorites, ratings and saved search state
- Trip Planner with randomized travel recommendations and validated request form
- Open-Meteo public API integration with loading, timeout and error states
- jQuery interactions: progress indicator, counters, notifications and lazy loading
- Optional UI sounds and accessible reduced-motion support

## Project structure
```text
index.html
destinations.html
regions.html
tips.html
planner.html
creators.html
signup.html
login.html
profile.html
css/style.css
js/script.js
js/theme-init.js
images/
sounds/
vendor/
```

## Run locally
Open the folder with a local static server such as VS Code Live Server and start from `index.html`.

## Important note
Authentication is intentionally a front-end simulation required by the assignment. User details are stored in the browser with `localStorage`; there is no backend or production password storage.

## Team
Yerkenkyzy Aruzhan · Ilyas Samal · Saparova Mereilim — SE-2502, Astana IT University
