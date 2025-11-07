# Block Breaker Game

A classic block breaker game built with HTML5 Canvas and JavaScript.

## How to Run

### Option 1: Open Directly in Browser
Simply open `index.html` in your web browser:
- Double-click `index.html` from your file explorer, or
- Drag and drop `index.html` into a browser window, or
- Right-click `index.html` → Open with → Your browser

### Option 2: Using Python (Recommended)
Start a local web server:
```bash
python3 -m http.server 8000
```
Then open your browser and navigate to: `http://localhost:8000`

### Option 3: Using Node.js
If you have Node.js installed:
```bash
npx http-server -p 8000
```
Then open your browser and navigate to: `http://localhost:8000`

## How to Play

**Controls:**
- **Mouse**: Move paddle by moving cursor over the game area
- **Arrow Keys** (← →): Alternative paddle control
- **SPACE**: Start game / Pause / Resume / Restart

**Objective:**
- Break all blocks to advance to the next level
- Don't let the ball fall below the paddle
- You have 3 lives - game over when all lives are lost

**Scoring:**
- Top row (red): 50 points
- Second row (orange): 40 points
- Third row (yellow): 30 points
- Fourth row (green): 20 points
- Bottom row (blue): 10 points

## Game Features
- Progressive difficulty - ball speed increases with each level
- Lives system (3 lives)
- Score tracking
- Pause/resume functionality
- Smooth paddle and ball physics
- Colorful blocks with visual effects
