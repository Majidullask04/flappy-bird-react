# Flappy Bird — React + JavaScript

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/vite-7.3.6-blue.svg)](https://vitejs.dev/)

A sleek, lightweight clone of the classic Flappy Bird game built with **React**, **JavaScript**, and the **Web Audio API**. The project showcases modern front‑end techniques such as state management with hooks, requestAnimationFrame‑driven game loops, and procedural content generation.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Getting Started](#getting-started)
- [Controls](#controls)
- [Project Structure](#project-structure)
- [What This Project Teaches](#what-this-project-teaches)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

![Flappy Bird Demo](./screenshot.png)

---

## Features

- Real‑time physics using `requestAnimationFrame`
- Smooth animations with CSS‑based graphics
- Sound effects powered by the Web Audio API
- Persistent high‑score saved in `localStorage`
- Responsive controls: keyboard, mouse, touch
- Simple and modular component architecture

---

## Getting Started

### Prerequisites
- Node.js (>= 18) and npm

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/flappy-bird-react.git
cd flappy-bird-react

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
The Vite dev server will start and automatically open a browser window. If the default port (5173) is busy, Vite will select the next available port.

### Production Build
```bash
npm run build
npm run preview
```
---

## Controls
- **Space** / **Arrow Up** / **Mouse Click** / **Touch** – Flap the bird

---

## Project Structure
```
src/
├─ components/      # React components (Bird, Pipe, HUD, etc.)
├─ hooks/          # Custom hooks (useGameAudio)
├─ styles.css      # Global CSS styles
├─ App.jsx         # Main application component
└─ index.jsx       # Entry point
```
---

## What This Project Teaches
- React state management with `useState`
- Mutable values for the game loop using `useRef`
- Animation loops via `requestAnimationFrame`
- Handling keyboard, pointer, and touch events
- Collision detection logic
- Procedural generation of obstacles
- Storing and retrieving data from `localStorage`
- Using the Web Audio API for sound effects

---

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests. Please follow the existing code style and run `npm run lint` before submitting.

---

## License

MIT
