# Developer Guide - @flowcraft/canvas

## 🎯 Project Overview

This npm package provides a complete workflow canvas solution with 1000+ lines of production-ready TypeScript code. It's designed to be the easiest way to add visual workflow functionality to any React application.

---

## 📂 Architecture

### Component Hierarchy

```
FlowCanvas (Main Component)
├── ReactFlow (from reactflow library)
│   ├── Background (grid/dots pattern)
│   ├── Controls (zoom/pan buttons)
│   ├── MiniMap (overview)
│   └── Panel (status indicator)
├── Node Components
│   ├── StartNode
│   ├── EndNode
│   ├── ActionNode
│   ├── ConditionalNode
│   ├── InputNode
│   ├── OutputNode
│   ├── ApiCallNode
│   └── TransformNode
└── Context Providers
    ├── ThemeProvider (styling)
    └── FlowProvider (state)
```

### Data Flow

```
User Interaction
    ↓
FlowCanvas Component
    ↓
ReactFlow State Management
    ↓
Node/Edge State Updates
    ↓
Callback Props (onNodesChange, onEdgesChange)
    ↓
Parent Component State
```

---

## 🔧 Core Components

### 1. FlowCanvas.tsx (Main Component)

**Purpose**: Main wrapper that orchestrates the entire workflow canvas

**Key Features**:
- Manages nodes and edges state
- Handles user interactions (drag, connect, delete)
- Keyboard shortcuts (copy, paste, duplicate)
- Integrates Controls and Minimap
- Provides default node types

**Usage Pattern**:
```tsx
<FlowCanvas
  nodes={nodes}           // Node array
  edges={edges}           // Edge array
  onNodesChange={fn}      // Update callback
  onEdgesChange={fn}      // Update callback
  onConnect={fn}          // New connection callback
  showMinimap={true}      // Toggle minimap
  showControls={true}     // Toggle controls
/>
```

### 2. Node Components (8 Types)

**Pattern**: All nodes follow the same structure
```tsx
NodeComponent: React.FC<NodeProps<CustomNodeData>> = ({ data, selected })
  ├── Container div (styling, selection state)
  ├── Handle (input/output connection points)
  ├── Icon (visual indicator)
  ├── Label (node title)
  └── Description (optional details)
```

**Customization Points**:
- `data.color`: Background color
- `data.icon`: Custom icon component
- `data.label`: Display text
- `data.description`: Subtitle
- `data.config`: Custom configuration
- `data.onExecute`: Execution logic

### 3. Context Providers

#### ThemeProvider
**Purpose**: Global styling configuration

```tsx
const theme = {
  nodeBackground: string,
  nodeBorder: string,
  nodeColor: string,
  nodeShadow: string,
  handleBackground: string,
  handleBorder: string,
  primaryColor: string,
  secondaryColor: string
}
```

#### FlowProvider
**Purpose**: Workflow state management

**Provides**:
- Node/edge state
- Add/remove/update operations
- Node registry access
- Group operations

---

## 🎣 Custom Hooks

### useFlowcraft

**Purpose**: Main workflow operations hook

**Returns**:
```typescript
{
  nodes: FlowcraftNode[],
  edges: FlowcraftEdge[],
  setNodes: (nodes) => void,
  setEdges: (edges) => void,
  addNode: (node) => void,
  removeNode: (id) => void,
  updateNode: (id, data) => void,
  duplicateNode: (id) => void,
  createNode: (type, data, position?) => FlowcraftNode,
  deleteSelectedNodes: () => void,
  copySelectedNodes: () => string[],
  pasteNodes: (ids) => void
}
```

**Usage**:
```tsx
function Toolbar() {
  const { createNode, deleteSelectedNodes } = useFlowcraft();
  
  return (
    <button onClick={() => createNode('action', { label: 'New' })}>
      Add Node
    </button>
  );
}
```

### useNodeRegistry

**Purpose**: Dynamic node type management

**Use Cases**:
- Register custom node types
- Discover available nodes
- Build node palette UI
- Filter by category

---

## 🛠️ Utilities

### nodeRegistry.ts

**Purpose**: Central registry for node types

**Pattern**:
```typescript
class NodeRegistry {
  private registry: Map<string, NodeRegistryItem>
  
  register(type, component, config): void
  get(type): NodeRegistryItem | undefined
  getAll(): NodeRegistryItem[]
  getAllByCategory(category): NodeRegistryItem[]
  getTypes(): Record<string, Component>
}
```

### helpers.ts

**Utility Functions**:
- `generateId()`: Unique node IDs
- `getNodeCenter()`: Calculate node center point
- `copyNodes()`: Duplicate node array
- `getConnectedEdges()`: Find node connections
- `validateConnection()`: Check connection validity
- `calculateNodePosition()`: Auto-positioning
- `groupNodesBySelection()`: Separate selected/unselected
- `calculateBoundingBox()`: Get group boundaries

---

## 📝 Type System

### Core Types

```typescript
// Node with custom data
interface FlowcraftNode extends Node<CustomNodeData> {
  id: string
  type: string
  position: { x: number; y: number }
  data: CustomNodeData
}

// Node data structure
interface CustomNodeData {
  label: string
  description?: string
  icon?: React.ReactNode
  color?: string
  config?: Record<string, any>
  onExecute?: (data: any) => Promise<any> | any
  onChange?: (data: any) => void
}

// Connection between nodes
interface FlowcraftEdge extends Edge {
  id: string
  source: string
  target: string
  animated?: boolean
}
```

---

## 🎨 Styling Strategy

### TailwindCSS Integration

All nodes use Tailwind utility classes:
```tsx
className={`
  px-4 py-3                    // Padding
  rounded-lg                    // Border radius
  bg-white                      // Background
  border-2                      // Border
  shadow-md                     // Shadow
  min-w-[180px]                // Min width
  transition-all               // Smooth transitions
  ${selected ? 'border-blue-500 ring-2' : 'border-gray-200'}
`}
```

### Custom Styling

Users can override with:
1. **Inline styles**: `style={{ borderColor: data.color }}`
2. **CSS classes**: `className` prop
3. **Theme provider**: Global theme object

---

## ⌨️ Keyboard Shortcuts

Implemented in FlowCanvas component:

| Key | Action | Implementation |
|-----|--------|----------------|
| Delete/Backspace | Delete selected | Filter out selected nodes/edges |
| Ctrl+C | Copy | Store selected nodes in localStorage |
| Ctrl+V | Paste | Create copies with offset position |
| Ctrl+D | Duplicate | Clone with 50px offset |

**Implementation Pattern**:
```tsx
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Delete') {
    // Filter selected nodes
    setNodes(nds => nds.filter(n => !n.selected))
  }
  
  if (event.ctrlKey && event.key === 'c') {
    // Store in clipboard
    localStorage.setItem('clipboard', JSON.stringify(selected))
  }
}
```

---

## 🔌 Extension Points

### 1. Custom Node Types

```tsx
// Define custom node
const DatabaseNode = ({ data, selected }) => (
  <div className="custom-node">
    <Handle type="target" position={Position.Left} />
    {data.label}
    <Handle type="source" position={Position.Right} />
  </div>
)

// Register with canvas
<FlowCanvas nodeTypes={{ database: DatabaseNode }} />
```

### 2. Custom Execution Logic

```tsx
const nodes = [{
  id: '1',
  type: 'apiCall',
  data: {
    label: 'Fetch Data',
    config: { url: '/api/data' },
    onExecute: async (data) => {
      const res = await fetch(data.config.url)
      return await res.json()
    }
  }
}]
```

### 3. Connection Validation

```tsx
const onConnect = (connection) => {
  // Custom validation
  if (isValidConnection(connection)) {
    setEdges(eds => addEdge(connection, eds))
  }
}
```

---

## 📊 State Management

### Local State (useState)
Default approach - simple and effective:
```tsx
const [nodes, setNodes] = useState([])
const [edges, setEdges] = useState([])
```

### Context API (useContext)
For deeply nested components:
```tsx
<FlowProvider initialNodes={nodes} initialEdges={edges}>
  <App />
</FlowProvider>
```

### Redux/Zustand
For global state management:
```tsx
const nodes = useSelector(state => state.workflow.nodes)
const dispatch = useDispatch()

<FlowCanvas
  nodes={nodes}
  onNodesChange={(n) => dispatch(updateNodes(n))}
/>
```

---

## 🧪 Testing Strategy

### Unit Tests (Recommended)

```tsx
import { render } from '@testing-library/react'
import { FlowCanvas } from '@flowcraft/canvas'

test('renders nodes', () => {
  const nodes = [{ id: '1', type: 'start', position: { x: 0, y: 0 }, data: {} }]
  const { container } = render(<FlowCanvas nodes={nodes} />)
  expect(container.querySelector('[data-id="1"]')).toBeInTheDocument()
})
```

### Integration Tests

```tsx
test('connects nodes', () => {
  const handleConnect = jest.fn()
  render(<FlowCanvas onConnect={handleConnect} />)
  // Simulate connection
  expect(handleConnect).toHaveBeenCalled()
})
```

---

## 🚀 Performance Optimization

### Memoization

```tsx
const nodeTypes = useMemo(() => ({
  ...defaultNodeTypes,
  ...customNodeTypes
}), [customNodeTypes])
```

### Callback Optimization

```tsx
const handleNodesChange = useCallback((changes) => {
  onNodesChangeInternal(changes)
  onNodesChange?.(nodes)
}, [nodes, onNodesChange])
```

### Large Workflows

For 500+ nodes:
- Enable `onlyRenderVisibleElements`
- Use `nodeExtent` to limit pan area
- Implement virtual scrolling
- Lazy load node data

---

## 📦 Build Configuration

### Rollup Setup

**Outputs**:
- CommonJS (`dist/index.js`) - Node.js
- ES Module (`dist/index.esm.js`) - Modern bundlers
- TypeScript definitions (`dist/index.d.ts`)

**Plugins**:
- `@rollup/plugin-typescript` - TS compilation
- `rollup-plugin-postcss` - CSS processing
- `rollup-plugin-peer-deps-external` - Exclude peer deps

---

## 🔍 Debugging

### React DevTools
- Inspect component tree
- View props and state
- Track re-renders

### Console Logging
```tsx
onNodesChange={(nodes) => {
  console.log('Nodes changed:', nodes)
  setNodes(nodes)
}}
```

### Reactflow DevTools
```tsx
<FlowCanvas proOptions={{ hideAttribution: false }} />
```

---

## 📚 Further Learning

### Recommended Reading
1. [Reactflow Documentation](https://reactflow.dev)
2. [React Hooks Guide](https://react.dev/reference/react)
3. [TypeScript Handbook](https://www.typescriptlang.org/docs/)
4. [TailwindCSS Docs](https://tailwindcss.com/docs)

### Code Examples
- See `/example` directory for complete app
- Check `ADVANCED.md` for patterns
- Review `API.md` for all options

---

## 🤝 Best Practices

1. **Always wrap in ReactFlowProvider** for advanced features
2. **Use TypeScript** for type safety
3. **Memoize callbacks** to prevent re-renders
4. **Validate connections** before adding edges
5. **Persist workflows** to localStorage or API
6. **Test with large datasets** (500+ nodes)
7. **Handle errors gracefully** in onExecute functions
8. **Document custom nodes** for team members
9. **Version control** workflow schemas
10. **Monitor performance** with React DevTools

---

## ⚡ Quick Tips

- Use `fitView` to auto-center canvas
- Enable `snapToGrid` for alignment
- Set `minZoom` and `maxZoom` for limits
- Use `defaultViewport` for initial position
- Handle `onConnect` to validate connections
- Implement `onNodeDoubleClick` for editing
- Use `elevateEdgesOnSelect` for clarity
- Enable `deleteKeyCode={null}` to disable default delete

---

**Happy Building!** 🎉

For more help, check the other documentation files or create an issue.
