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

## Install dependencies

Run the install command from the `biome-buddy` project directory. 

```bash
cd biome-buddy
npm install
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