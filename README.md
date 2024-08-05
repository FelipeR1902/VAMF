# VAMF Project

This project is a Vite-based web application. Follow the instructions below to get started.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Prerequisites
Currently, two official plugins are available:

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/FelipeR1902/VAMF
   cd VAMF
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm run dev
   ```

4. **Open the application in your browser:**

   The development server will start and you can open your browser and navigate to `http://localhost:5173` to see the application running.

## Scripts

In the client folder, you can run the following npm scripts:

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Lints the codebase using ESLint.

## Project Structure

The project has the following structure:

```
VAMF/
├── client/         # Frontend application
│   ├── src/        # Source files
│   ├── public/     # Public files
│   ├── index.html  # Main HTML file
│   ├── package.json
│   └── vite.config.js
└── server/         # Backend application
```
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
