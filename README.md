# Portfolio Website - Modernization Guide

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start a development server at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
├── src/
│   ├── components/          # Reusable components
│   ├── styles/              # CSS modules and variables
│   ├── utils/               # Utility functions
│   ├── main.ts              # Application entry point
│   └── registerSW.ts        # Service worker registration
├── css/                     # Legacy CSS (to be migrated)
├── js/                      # Legacy JS (to be migrated)
├── favicon/                 # Icons and favicons
├── logo/                    # Logo assets
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run clean` - Remove build artifacts

## 📝 Code Quality

### ESLint
ESLint is configured to enforce code quality standards. Run:
```bash
npm run lint
```

### Prettier
Prettier is configured for consistent code formatting. Run:
```bash
npm run format
```

### TypeScript
TypeScript provides type safety. Check types with:
```bash
npm run type-check
```

## 🌐 Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Deployment
1. Build the project: `npm run build`
2. The `dist/` folder contains the production files
3. Push to GitHub, and the CI/CD pipeline will handle deployment

## 🎨 Theming

The site uses CSS custom properties (variables) for theming. All theme colors and settings are defined in `src/styles/variables.css`.

### Dark Mode
Dark mode is automatically detected from system preferences and can be toggled by users. The state is persisted in localStorage.

## 📱 Progressive Web App (PWA)

This site is configured as a PWA with:
- Offline support
- Install prompt
- App-like experience on mobile
- Service worker caching

## 🔐 Security

- Content Security Policy configured
- Secure headers in place
- HTTPS enforced
- No exposed API keys in client code

## 🐛 Troubleshooting

### Build Fails
1. Clear node_modules: `rm -rf node_modules package-lock.json`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Service Worker Issues
Clear browser cache and unregister old service workers in DevTools > Application > Service Workers

## 📚 Migration Notes

### Legacy Code
The old code in `js/` and `css/` directories is being gradually migrated to the new `src/` structure. During migration:
- Old files are kept for reference
- New modular code is in `src/`
- Build process bundles everything correctly

### Breaking Changes
- Cookie management now uses modern API (`src/utils/cookies.ts`)
- DOM manipulation uses utility functions (`src/utils/dom.ts`)
- State management is centralized (`src/utils/state.ts`)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` and `npm run format`
4. Test locally with `npm run dev`
5. Build and test with `npm run build && npm run preview`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
