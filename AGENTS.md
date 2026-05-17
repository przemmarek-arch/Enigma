mordo # Repository Guidelines

## Project Structure & Module Organization

Enigma is a React 18 desktop app packaged with Electron. Application source lives in `src/`: `App.js` coordinates the UI, `src/components/` contains one functional React component per file, and `src/utils/pdfUtils.js` holds PDF helpers. Electron entry points are in `public/`: `electron.js`, `preload.js`, and `index.html`. Tailwind styles start in `src/index.css`, with configuration in `tailwind.config.js` and `postcss.config.js`. Treat `build/`, `dist/`, and `node_modules/` as generated output.

## Build, Test, and Development Commands

- `npm install`: install locked dependencies.
- `npm start`: run the React development server in a browser.
- `npm run electron-dev`: start React and launch Electron once `http://localhost:3000` is ready.
- `npm run build`: create the production React bundle in `build/`.
- `npm run electron`: launch Electron against the configured app entry.
- `npm run electron-build`: build React and package the Electron app.
- `npm run package-win`: build a Windows NSIS installer without publishing.
- `npm test`: run the Create React App test runner.

## Coding Style & Naming Conventions

Use JavaScript with functional React components and hooks. Name component files and exports in PascalCase, such as `PasswordInput.js`; use camelCase for functions, variables, and utility exports. Keep one primary component per file. Prefer Tailwind utility classes over new global CSS, and follow the existing mobile-first layout style. Preserve Electron security defaults: use `preload.js` for renderer access and avoid `eval` or `innerHTML`.

## Testing Guidelines

No dedicated test files are currently checked in. Add focused tests near the code they cover using Create React App conventions, for example `src/components/PasswordInput.test.js`. Run `npm test` before opening a pull request. For encryption, decryption, PDF, or IPC changes, also verify manually with `npm run electron-dev`.

## Commit & Pull Request Guidelines

Git history is not available in this environment, so use clear imperative commit messages such as `Add PDF password validation` or `Fix decrypt error handling`. Pull requests should describe the user-visible change, list verification, link related issues, and include screenshots or recordings for UI changes. Do not commit generated `build/`, `dist/`, or dependency changes unless the release process requires them.

## Security & Configuration Tips

This app handles local files and passwords. Never log passwords, derived keys, salts, IVs, or decrypted file contents. Keep encryption parameters documented, and update `README.md`, `DEVELOPMENT.md`, or `ARCHITECTURE.md` when behavior changes.
