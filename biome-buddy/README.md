# Biome Buddy

Biome Buddy is a small React application for the CSE210 final project. It is an educational ecosystem simulator that helps students explore how species, populations, and simple events interact over simulated seasons. 


## Prerequisites

- Node.js (LTS recommended, e.g. v18+ or v20). You can manage versions with nvm.
- npm (comes with Node). 

Check your versions:

```bash
node --version
npm --version
```


## Start the dev server

Start Vite's dev server and open the app in your browser:

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Run tests

This project uses Vitest + Testing Library for unit/DOM tests. Make sure the devDependencies above are installed and then run:

```bash
npm test
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
