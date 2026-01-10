# Bird Game

A 3D browser-based game built with Three.js where you control a bird navigating through obstacles.

## About

This is a simple endless runner game featuring a 3D bird that must avoid obstacles while flying. The game increases in difficulty over time as the speed progressively increases. Your goal is to survive as long as possible!

## Technologies Used

- **Three.js** - JavaScript 3D library for rendering 3D graphics in the browser
- **HTML5** - Structure and canvas element
- **CSS3** - Styling and UI elements
- **JavaScript (ES6+)** - Game logic and animations
- **OrbitControls** - Three.js addon for camera controls

## Features

- 3D graphics with realistic lighting and shadows
- Dynamic cloud generation
- Progressive difficulty increase
- Timer to track survival time
- Game over and restart functionality
- Smooth bird movement and animations

## How to Start

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd Bird-Game
   ```

2. **Install dependencies**
   
   This project uses ES6 modules with Three.js. You'll need a local development server to run it.

   Option 1 - Using Python (if installed):
   ```bash
   python -m http.server 8000
   ```

   Option 2 - Using Node.js with npx:
   ```bash
   npx http-server -p 8000
   ```

   Option 3 - Using VS Code Live Server extension

3. **Open in browser**
   
   Navigate to `http://localhost:8000` in your web browser

4. **Play the game**
   - Click "Start Game" to begin
   - Use mouse controls to move the bird up and down
   - Avoid obstacles to stay alive
   - Try to beat your best time!

## Controls

- **Mouse Movement** - Control the bird's vertical position
- **Retry Button** - Restart the game after game over

## Project Structure

```
Bird-Game/
├── index.html    # Main HTML file with game UI
├── main.js       # Game logic and Three.js implementation
└── README.md     # This file
```

## Credits

Developed as part of Computer Graphics coursework at Instituto Politécnico do Porto.
