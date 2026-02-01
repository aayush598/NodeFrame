# Publishing Guide

## Prerequisites

1. **NPM Account**: Create account at https://www.npmjs.com
2. **NPM CLI**: Ensure npm is installed (`npm --version`)
3. **Package Built**: Run `yarn build` before publishing

## Publishing Steps

### 1. Login to NPM

```bash
npm login
```

Enter your credentials when prompted.

### 2. Update Version (if needed)

```bash
# For patch updates (1.0.0 -> 1.0.1)
npm version patch

# For minor updates (1.0.0 -> 1.1.0)
npm version minor

# For major updates (1.0.0 -> 2.0.0)
npm version major
```

### 3. Build the Package

```bash
cd /app/flowcraft-canvas
yarn build
```

### 4. Test Locally (Optional but Recommended)

```bash
# Link package locally
npm link

# In another project
npm link @flowcraft/canvas
```

### 5. Publish to NPM

```bash
# For scoped packages (first time)
npm publish --access public

# For updates
npm publish
```

### 6. Verify Publication

Check your package at: https://www.npmjs.com/package/@flowcraft/canvas

---

## Publishing Checklist

Before publishing, ensure:

- [ ] All tests pass
- [ ] Package builds successfully (`yarn build`)
- [ ] README.md is complete and accurate
- [ ] Version number is updated in package.json
- [ ] CHANGELOG.md is updated
- [ ] No sensitive data in published files (check .npmignore)
- [ ] All dependencies are correctly listed
- [ ] License is specified (MIT)
- [ ] Repository URL is added (if applicable)

---

## Package.json Configuration

Ensure these fields are correct:

```json
{
  "name": "@flowcraft/canvas",
  "version": "1.0.0",
  "description": "Professional workflow canvas library",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist", "README.md"],
  "repository": {
    "type": "git",
    "url": "https://github.com/flowcraft/canvas.git"
  },
  "keywords": [
    "workflow",
    "canvas",
    "react",
    "typescript",
    "drag-and-drop"
  ],
  "author": "FlowCraft",
  "license": "MIT"
}
```

---

## Post-Publication

### Update Documentation

1. Add badge to README:
```markdown
[![npm version](https://badge.fury.io/js/%40flowcraft%2Fcanvas.svg)](https://www.npmjs.com/package/@flowcraft/canvas)
```

2. Update installation instructions with actual package name

3. Create GitHub release (if using GitHub):
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Monitor

- Check download stats: https://npm-stat.com/charts.html?package=@flowcraft/canvas
- Monitor issues on npm or GitHub
- Respond to user feedback

---

## Version Management

### Semantic Versioning

Follow semver (https://semver.org/):

- **Patch (1.0.X)**: Bug fixes, no API changes
- **Minor (1.X.0)**: New features, backward compatible
- **Major (X.0.0)**: Breaking changes

### Pre-release Versions

For beta releases:

```bash
npm version prerelease --preid=beta
# Results in: 1.0.0-beta.0

npm publish --tag beta
```

Users install with:
```bash
npm install @flowcraft/canvas@beta
```

---

## Updating the Package

### 1. Make Changes

```bash
# Edit files
# Update tests
# Update CHANGELOG.md
```

### 2. Update Version

```bash
npm version patch  # or minor/major
```

### 3. Rebuild and Publish

```bash
yarn build
npm publish
```

---

## Troubleshooting

### "Package already exists"

If the package name is taken, you must:
- Choose a different name
- Use a scope (e.g., `@yourname/package`)

### "You must be logged in"

```bash
npm logout
npm login
```

### "403 Forbidden"

Ensure:
- You're logged in with correct account
- For scoped packages, use `--access public`
- Package name isn't taken

### "Missing files in published package"

Check `.npmignore` and `package.json` `files` field.

---

## Unpublishing (Use Carefully!)

```bash
# Unpublish specific version (within 72 hours)
npm unpublish @flowcraft/canvas@1.0.0

# Deprecate instead (recommended)
npm deprecate @flowcraft/canvas@1.0.0 "Please use version 1.0.1"
```

⚠️ **Warning**: Unpublishing is discouraged and may be disallowed after 72 hours.

---

## Testing Before Publishing

### Test Build Output

```bash
cd /app/flowcraft-canvas
yarn build
ls -la dist/
```

Verify:
- `index.js` exists
- `index.esm.js` exists
- `index.d.ts` exists
- Type definition files (.d.ts) are present

### Test in Example App

```bash
cd example
yarn install
yarn start
```

Verify the example app runs correctly.

---

## Distribution Tags

Manage release channels:

```bash
# Publish to beta channel
npm publish --tag beta

# Publish to latest (default)
npm publish --tag latest

# Move latest tag to specific version
npm dist-tag add @flowcraft/canvas@1.0.1 latest
```

---

## Registry Configuration

If using private registry:

```bash
# Set registry
npm config set registry https://registry.npmjs.org/

# View current registry
npm config get registry
```

---

## Support and Maintenance

After publishing:

1. **Monitor Issues**: Respond to bug reports and feature requests
2. **Regular Updates**: Keep dependencies updated
3. **Security**: Address security vulnerabilities promptly
4. **Documentation**: Keep docs in sync with code
5. **Community**: Engage with users, accept PRs

---

## Success Metrics

Track:
- Weekly downloads
- GitHub stars (if open source)
- Issue resolution time
- Community contributions
- User satisfaction

---

## Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [NPM Best Practices](https://docs.npmjs.com/cli/v8/using-npm/developers)
- [Package Maintenance](https://docs.npmjs.com/packages-and-modules/updating-your-published-package)
