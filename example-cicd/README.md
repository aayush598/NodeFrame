# CI/CD Pipeline Builder

A visual CI/CD pipeline automation tool built with [NodeFrame](../README.md). Design deployment pipelines using drag-and-drop nodes and export production-ready configurations for GitHub Actions, GitLab CI, and Jenkins.

![CI/CD Pipeline Builder](https://img.shields.io/badge/NodeFrame-CI%2FCD%20Builder-blue)

## Features

### 🎨 Visual Pipeline Design
- Drag-and-drop interface for building CI/CD workflows
- 9+ specialized DevOps nodes
- Real-time visual feedback
- Node grouping for complex pipelines

### 🚀 Multi-Platform Code Generation
Export your visual pipeline to:
- **GitHub Actions** (`.github/workflows/ci.yml`)
- **GitLab CI** (`.gitlab-ci.yml`)
- **Jenkins** (`Jenkinsfile`)

### 📦 One-Click Export
- Export individual platform configs
- Download complete package (ZIP) with all platforms
- Copy code to clipboard
- Syntax-highlighted preview

## Available Nodes

### Triggers
- **Git Push Trigger** - Configure branch filters and event types

### Build
- **Install Dependencies** - npm, yarn, pnpm, bun support with caching
- **Build App** - Vite, Webpack, Rollup, esbuild
- **Docker Build** - Multi-tag support with registry push

### Test & Quality
- **Run Tests** - Unit, Integration, E2E with coverage
- **Lint Code** - ESLint, Prettier, Biome with auto-fix
- **Security Scan** - Snyk, Trivy, SonarQube

### Deploy
- **Deploy** - AWS, Vercel, Kubernetes, SSH

### Notifications
- **Slack Notify** - Channel notifications with conditional triggers

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

Open [http://localhost:5174](http://localhost:5174) to start building your pipeline.

## Usage Example

### 1. Design Your Pipeline

Drag nodes from the sidebar to the canvas:

```
Git Push → Install Deps → Run Tests → Build App → Deploy
```

### 2. Configure Nodes

Click any node to configure its properties in the Inspector:
- Set package manager (npm/yarn/pnpm/bun)
- Configure test framework
- Set deployment platform and environment
- Add notification channels

### 3. Export Code

Click **"Export Code"** in the header:
1. Select your platform (GitHub/GitLab/Jenkins)
2. Preview the generated YAML/Groovy
3. Copy or download the configuration
4. Or export all platforms as a ZIP package

### 4. Deploy

Copy the generated file to your repository:

```bash
# GitHub Actions
cp ci.yml .github/workflows/

# GitLab CI
cp .gitlab-ci.yml ./

# Jenkins
cp Jenkinsfile ./
```

## Example Pipelines

### Node.js CI/CD
```
Git Push (main)
  ↓
Install Dependencies (npm, cached)
  ↓
Lint Code (ESLint)
  ↓
Run Tests (Jest, coverage)
  ↓
Build App (Vite)
  ↓
Security Scan (Snyk)
  ↓
Deploy (Vercel, production)
  ↓
Slack Notify (#deployments)
```

### Docker Microservice
```
Git Push (develop)
  ↓
Install Dependencies (bun)
  ↓
Run Tests (Vitest)
  ↓
Docker Build (my-app:latest)
  ↓
Security Scan (Trivy)
  ↓
Deploy (Kubernetes, staging)
```

## Node Configuration

Each node has configurable properties accessible via the Inspector panel:

### Git Push Trigger
- Event Type: push, pull_request, tag
- Branches: Comma-separated list
- Path Filters: Trigger only on specific file changes

### Install Dependencies
- Package Manager: npm, yarn, pnpm, bun
- Enable Cache: Speed up builds
- Custom Command: Override default install

### Test Runner
- Test Type: unit, integration, e2e
- Framework: Jest, Vitest, Playwright, Cypress
- Coverage: Enable code coverage reports

### Deploy
- Platform: AWS, Vercel, Kubernetes, SSH
- Environment: development, staging, production
- Region: Cloud region
- Health Check: URL for deployment verification

## Generated Code Examples

### GitHub Actions
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm test
      - run: npm run build
```

### GitLab CI
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
```

### Jenkins
```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
    }
}
```

## Advanced Features

### Parallel Execution
Create branching workflows for parallel test suites or multi-environment deployments.

### Conditional Deployment
Use conditional nodes to deploy only when tests pass and branch matches criteria.

### Matrix Builds
Configure nodes to test across multiple environments (Node 18, 20, 22).

### Reusable Workflows
Group common patterns (build + test) and reuse across pipelines.

## Technology Stack

- **NodeFrame** - Visual workflow engine
- **React Flow** - Canvas rendering
- **js-yaml** - YAML generation
- **JSZip** - Package export
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## Creating Custom Nodes

Add your own DevOps nodes:

```typescript
import { nodeRegistry } from '@nodeframe/utils/nodeRegistry';

nodeRegistry.register('customNode', CustomNodeComponent, {
  id: 'customNode',
  type: 'customNode',
  label: 'Custom Step',
  category: 'Custom',
  color: '#ff6b6b',
  propertyDefinitions: [
    {
      name: 'command',
      label: 'Command',
      type: 'string',
    },
  ],
});
```

## Contributing

Contributions are welcome! This example demonstrates NodeFrame's capabilities for enterprise workflow automation.

## License

MIT - See [LICENSE](../LICENSE) for details

## Related

- [NodeFrame Core](../README.md)
- [Basic Example](../example/README.md)
- [Documentation](../docs/README.md)

---

**Built with ❤️ using NodeFrame** - The visual workflow engine for modern applications
