# Deployment Workflow Guide

## 🚀 Initial Deployment (Do This Now)

### Step 1: Test Locally
```bash
# Build the production version
npm run build

# Preview what will be deployed
npm run preview
```

Visit `http://localhost:4000` to see the production build. If it looks good, proceed.

---

### Step 2: Commit & Push Changes
```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: modernize site architecture with Vite, TypeScript, and modular structure"

# Push to trigger deployment
git push origin main
```

---

### Step 3: Monitor Deployment
1. Go to your GitHub repo
2. Click the **"Actions"** tab
3. Watch the "Deploy to GitHub Pages" workflow run (takes ~2-5 minutes)
4. ✅ Green checkmark = Success
5. ❌ Red X = Check logs for errors

---

### Step 4: Verify Live Site
Once deployment completes:
1. Visit: `https://ivansojivarghese.github.io`
2. Check browser console (F12) - should be no errors
3. Test in Chrome DevTools → Application → Service Worker
4. Try offline mode to test PWA
5. Check on mobile device

---

## 🔄 Daily Development Workflow

### For New Features or Changes:

```bash
# 1. Start development server
npm run dev

# 2. Make your changes in src/ directory
#    - Browser auto-reloads with HMR
#    - TypeScript errors show in terminal

# 3. Lint & format (optional but recommended)
npm run lint
npm run format

# 4. Test build locally
npm run build
npm run preview

# 5. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main

# 6. GitHub Actions deploys automatically
```

---

## 📁 Where to Add Content

### Adding New Pages:
```
src/
  ├── pages/
  │   ├── about.ts
  │   ├── portfolio.ts
  │   └── contact.ts
```

### Adding Components:
```
src/
  ├── components/
  │   ├── Navigation.ts
  │   ├── Card.ts
  │   └── Footer.ts
```

### Styling:
```
src/
  ├── styles/
  │   ├── navigation.css
  │   ├── components.css
  │   └── pages.css
```

### Utilities:
```
src/
  ├── utils/
  │   ├── api.ts       # API calls
  │   ├── helpers.ts   # Helper functions
  │   └── constants.ts # Constants
```

---

## 🔍 Migrating Legacy Code

### Gradual Migration Strategy:

**Option 1: Keep Both (Recommended for now)**
```
├── index.html (new, modernized)
├── index-legacy.html (old, backup)
├── src/ (new code)
└── js/ (legacy code - gradually migrate)
```

**Option 2: Feature-by-Feature**
1. Pick one feature (e.g., dark mode toggle)
2. Create new module in `src/components/DarkMode.ts`
3. Remove old code from legacy files
4. Test thoroughly
5. Repeat for next feature

**Example: Migrating Dark Mode**
```typescript
// src/components/DarkMode.ts
import { themeState } from '../utils/state';

export class DarkModeToggle {
  private button: HTMLButtonElement;

  constructor(selector: string) {
    this.button = document.querySelector(selector) as HTMLButtonElement;
    this.init();
  }

  private init(): void {
    this.button.addEventListener('click', () => {
      const current = themeState.get();
      themeState.set(current === 'dark' ? 'light' : 'dark');
    });

    // Subscribe to theme changes
    themeState.subscribe(theme => {
      this.updateUI(theme);
    });
  }

  private updateUI(theme: 'light' | 'dark'): void {
    this.button.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}
```

---

## 🐛 Troubleshooting

### Build Fails on GitHub Actions
```bash
# Check locally first
npm run build

# If it works locally but fails on GitHub:
# - Check Node version in .github/workflows/deploy.yml
# - Ensure package-lock.json is committed
# - Check for missing dependencies
```

### Site Shows Blank Page
```bash
# Check browser console for errors
# Verify base path in vite.config.js
# Check that dist/ folder was deployed

# Rebuild and test locally
npm run build
npm run preview
```

### Service Worker Issues
```bash
# Clear old service worker:
# 1. Open DevTools (F12)
# 2. Application → Service Workers
# 3. Unregister old workers
# 4. Clear site data
# 5. Reload
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# If needed, add type definitions:
npm install -D @types/[package-name]
```

---

## 📊 Performance Monitoring

### Check Build Size:
```bash
npm run build
# Look for output like:
# dist/assets/main-abc123.js    45.23 kB
# dist/assets/vendor-def456.js  32.45 kB
```

### Lighthouse Score:
1. Open deployed site
2. Chrome DevTools → Lighthouse
3. Run audit
4. Target: 90+ in all categories

---

## 🔒 Security Best Practices

### Regular Updates:
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install [package]@latest
```

### Dependabot (Automatic):
GitHub will automatically create PRs for dependency updates.
Review and merge them regularly.

---

## 🎯 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run format` | Format code |
| `npm run type-check` | Check TypeScript types |
| `npm run clean` | Remove build artifacts |

---

## 📝 Git Workflow

### Branching Strategy (Optional):
```bash
# For major features, use branches:
git checkout -b feature/new-portfolio-section
# ... make changes ...
git commit -m "feat: add portfolio section"
git push origin feature/new-portfolio-section
# Create PR on GitHub, merge to main
```

### Commit Message Convention:
```
feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code restructuring
perf: performance improvements
test: adding tests
chore: maintenance tasks
```

---

## 🚨 Rollback Plan

### If Something Goes Wrong:

**Quick Rollback:**
```bash
# Revert to legacy version
git mv index.html index-new-temp.html
git mv index-legacy.html index.html
git commit -m "revert: rollback to legacy version"
git push origin main
```

**Restore Modernized Version:**
```bash
git mv index.html index-legacy.html
git mv index-new-temp.html index.html
git commit -m "restore: bring back modernized version"
git push origin main
```

---

## 📈 Next Steps After Deployment

### Week 1:
- [ ] Monitor error logs
- [ ] Check analytics (page load times)
- [ ] Test on different devices
- [ ] Gather user feedback

### Week 2:
- [ ] Migrate one legacy feature to new structure
- [ ] Add unit tests
- [ ] Improve accessibility

### Month 1:
- [ ] Migrate major features
- [ ] Add E2E tests
- [ ] Performance optimizations
- [ ] Remove legacy code

---

## 💡 Pro Tips

1. **Always test locally before pushing:**
   ```bash
   npm run build && npm run preview
   ```

2. **Use VSCode extensions:**
   - ESLint
   - Prettier
   - TypeScript Vue Plugin
   - Error Lens

3. **Keep dependencies updated:**
   ```bash
   npm update  # Weekly
   ```

4. **Monitor bundle size:**
   - Keep main bundle < 100KB
   - Lazy load heavy features

5. **Use browser caching:**
   - Vite adds hashes to filenames automatically
   - Service worker handles caching

---

## 🎉 You're Ready!

Run these commands now:
```bash
npm run build      # Test production build
npm run preview    # Verify it works
git add .          # Stage changes
git commit -m "feat: modernize site architecture"
git push origin main   # Deploy!
```

Then watch the GitHub Actions tab for deployment status!
