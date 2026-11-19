# Plunder Game - AI Coding Guidelines

## Project Overview
Plunder is a web-based online version of the board game Plunder, implemented with vanilla HTML, CSS, and JavaScript. The app uses multiple HTML pages for different game phases: landing page (`index.html`), player setup (`players.html`), and gameplay (`gameboard.html`). Game state is persisted using browser localStorage.

## Architecture
- **Pages**: Modular HTML files with shared CSS/JS includes
- **State Management**: localStorage for game data (players, settings)
- **UI Framework**: jQuery for DOM manipulation, custom CSS classes
- **Styling**: Pirate-themed with gold text, background images, and Font Awesome icons

## Key Patterns
- **Player Management**: Use `getPlayers()`, `savePlayers()`, `addPlayer()` from `scripts.js` for localStorage operations
- **Modal Handling**: CSS classes `.modal`, `.modal-content`, `.modal-close` with jQuery event delegation
- **Buttons**: `.btn` class with `.btn-container` wrapper for consistent styling
- **Dice Rolling**: `rollD6()` function in `gameplay.js` for random generation
- **Event Binding**: jQuery `.on()` and `.delegate()` for dynamic elements

## Development Workflow
- No build process required - serve static files directly
- Test in browser with live reload (e.g., VS Code Live Server extension)
- Dependencies: jQuery 3.7.1 (CDN), Font Awesome 5.15.3 (CDN)
- Debug: Console logs for game flow, localStorage inspection for state

## Conventions
- Pirate-themed language in UI text and comments (e.g., "Ahoy!", "Arrrgh!")
- Color-coded players with hex values stored in data attributes
- Number of players (3-6) determines game setup flow
- Incomplete gameplay logic in `gameplay.js` - extend with board game rules

## File Structure
- `js/scripts.js`: Player setup and navigation logic
- `js/gameplay.js`: Game mechanics (dice, turns)
- `css/styles.css`: Global styles and buttons
- `css/modals.css`: Modal-specific styling
- `css/gameboard.css`: Board layout (minimal)