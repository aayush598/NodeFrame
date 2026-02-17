# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1] - 2026-02-17

### Fixed
- Internal improvements and bug fixes

## [0.1.0] - 2026-02-16

### Added
- Initial release of workflow-canvas
- Core FlowCanvas component with reactflow integration
- 8 prebuilt professional node types:
  - StartNode - Workflow entry point
  - EndNode - Workflow completion
  - ActionNode - Execute actions
  - ConditionalNode - Branch logic with multiple outputs
  - InputNode - Receive data
  - OutputNode - Send data
  - ApiCallNode - HTTP requests
  - TransformNode - Data transformation
- Complete feature set:
  - Drag and drop nodes
  - Connect nodes with animated edges
  - Zoom in/out with smooth controls
  - Pan canvas navigation
  - Minimap for overview
  - Snap to grid functionality
  - Keyboard shortcuts (Copy, Paste, Delete, Duplicate)
  - Group node selection
- Context providers:
  - ThemeProvider for customization
  - FlowProvider for state management
- Custom hooks:
  - useWorkflow for workflow operations
  - useNodeRegistry for node management
  - useTheme for styling
  - useFlow for context access
- Node registry system for dynamic node management
- Helper utilities for node operations
- Full TypeScript support with comprehensive types
- Professional styling with TailwindCSS
- Example application demonstrating all features
- Comprehensive documentation:
  - Quick start guide
  - API reference
  - Advanced usage examples
  - Custom node creation guide

### Features
- ✅ Zero-config setup - works out of the box
- ✅ Fully customizable themes
- ✅ Custom node support
- ✅ Keyboard shortcuts
- ✅ Node validation
- ✅ Connection rules
- ✅ Workflow persistence
- ✅ Export/Import functionality
- ✅ React 18+ compatible
- ✅ TypeScript first
- ✅ Professional UI/UX
- ✅ Production-ready

### Developer Experience
- Simple API with minimal boilerplate
- Extensive documentation
- Type-safe development
- Hot reload support
- Tree-shakeable exports
- Optimized bundle size
