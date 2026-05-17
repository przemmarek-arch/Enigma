# Enigma

Enigma is a desktop application for local file encryption and PDF password management. It is built with React 18, Tailwind CSS and Electron, so it can run as a desktop app while keeping the main workflow focused on files stored on the user's machine.

The project provides two main areas:

- general file encryption and decryption using password-derived AES-256-CBC keys,
- PDF tools for adding, removing and changing document passwords.

## Features

- Encrypt local files into `.enigma` containers.
- Decrypt `.enigma` files back to their original file names.
- Drag-and-drop file selection.
- Password confirmation and basic password strength feedback.
- PDF password operations:
  - add a password to a PDF,
  - remove a password from a protected PDF,
  - change an existing PDF password,
  - create encrypted PDF output files.
- Electron desktop packaging for Windows.

## Technology Stack

- React 18
- Electron 27
- Tailwind CSS
- Web Crypto API
- Node.js Crypto API for Electron IPC helpers
- `pdf-lib` for PDF password operations
- Create React App tooling
- Electron Builder

## Requirements

- Node.js 14 or newer
- npm
- Windows, macOS or Linux for development

Windows packaging is configured through Electron Builder with NSIS and portable targets.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the React development server in a browser:

```bash
npm start
```

Run the full Electron development app:

```bash
npm run electron-dev
```

Create a production React build:

```bash
npm run build
```

Build the Electron application:

```bash
npm run electron-build
```

Build a Windows installer without publishing:

```bash
npm run package-win
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the Create React App development server. |
| `npm run electron-dev` | Starts React and launches Electron after `localhost:3000` is ready. |
| `npm run build` | Builds the production React bundle into `build/`. |
| `npm run electron` | Launches Electron against the configured app entry. |
| `npm run electron-build` | Builds React and packages the Electron app. |
| `npm run package-win` | Creates a Windows NSIS installer without publishing. |
| `npm test` | Runs the Create React App test runner. |

## Usage

### Encrypting Files

1. Open the **Szyfruj** tab.
2. Select or drag a supported file into the upload area.
3. Enter and confirm the password.
4. Click **Szyfruj plik**.
5. The encrypted file is downloaded with the `.enigma` extension.

The encrypted output stores the salt, IV and ciphertext in a single binary file:

```text
[32-byte salt][16-byte IV][encrypted payload]
```

### Decrypting Files

1. Open the **Odszyfruj** tab.
2. Select a `.enigma` file.
3. Enter the password used during encryption.
4. Click **Odszyfruj plik**.
5. The decrypted file is downloaded under the original file name.

### PDF Tools

Open the **PDF** tab to work with document passwords. The PDF tools support adding a new password, removing an existing password and changing a password on a protected PDF.

## Security Model

General file encryption uses:

- PBKDF2 with SHA-256,
- 100,000 derivation iterations,
- 32-byte random salt per file,
- 16-byte random IV per file,
- AES-256-CBC encryption.

Passwords, derived keys, salts, IVs and decrypted file contents should never be logged or persisted. The application generates encrypted output locally and does not require user accounts or external services.

Current implementation note: AES-CBC provides encryption but does not provide built-in authentication. For stronger tamper detection, a future version should use authenticated encryption such as AES-GCM or add an HMAC over the encrypted payload.

## Project Structure

```text
Enigma/
├── public/
│   ├── electron.js          # Electron main process
│   ├── preload.js           # Secure IPC bridge
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── DecryptSection.js
│   │   ├── EncryptSection.js
│   │   ├── FileUpload.js
│   │   ├── Header.js
│   │   ├── PasswordInput.js
│   │   ├── PDFDecryptSection.js
│   │   ├── PDFEncryptSection.js
│   │   ├── PDFPasswordManager.js
│   │   └── PDFSection.js
│   ├── utils/
│   │   └── pdfUtils.js      # PDF password helpers
│   ├── App.js               # Main React application
│   ├── index.js             # React entry point
│   └── index.css            # Tailwind styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

Generated directories such as `build/`, `dist/` and `node_modules/` should not be edited manually.

## Development Notes

- Keep React components functional and hook-based.
- Keep one primary component per file.
- Prefer Tailwind utility classes over new global CSS.
- Preserve Electron security settings: `nodeIntegration: false`, `contextIsolation: true` and renderer access through `preload.js`.
- Do not use `eval`, unsafe `innerHTML` or password/key logging.
- Add focused tests near the code they cover when changing encryption, PDF handling or IPC behavior.

## Testing

Run the test runner:

```bash
npm test
```

For changes touching encryption, decryption, PDF processing or Electron IPC, also verify the workflow manually:

```bash
npm run electron-dev
```

Recommended manual checks:

- encrypt and decrypt a sample file,
- try an incorrect password during decryption,
- add a password to a PDF,
- remove a password from a protected PDF,
- change a PDF password and reopen the generated file.

## Packaging

The Electron Builder configuration in `package.json` defines:

- app id: `com.enigma.encryptor`,
- product name: `Enigma`,
- Windows targets: NSIS installer and portable build.

Build artifacts are generated in `dist/`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
