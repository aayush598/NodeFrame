# API Reference

## Components

### FlowCanvas

Main canvas component for rendering workflows.

```tsx
import { FlowCanvas } from 'workflow-canvas';

<FlowCanvas
  nodes={nodes}
  edges={edges}
  onNodesChange={handleNodesChange}
  onEdgesChange={handleEdgesChange}
  onConnect={handleConnect}
  showMinimap={true}
  showControls={true}
  snapToGrid={false}
  snapGrid={[15, 15]}
  fitView={true}
  theme={customTheme}
  nodeTypes={customNodeTypes}
  className="my-canvas"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| nodes | WorkflowNode[] | [] | Array of workflow nodes |
| edges | WorkflowEdge[] | [] | Array of connections between nodes |
| onNodesChange | (nodes: WorkflowNode[]) => void | undefined | Callback when nodes change |
| onEdgesChange | (edges: WorkflowEdge[]) => void | undefined | Callback when edges change |
| onConnect | (connection: Connection) => void | undefined | Callback when nodes are connected |
| theme | WorkflowTheme | default | Custom theme object |
| showMinimap | boolean | true | Display minimap in corner |
| showControls | boolean | true | Display zoom/pan controls |
| className | string | '' | Additional CSS classes |
| nodeTypes | Record<string, Component> | prebuilt | Custom node type components |
| edgeTypes | Record<string, Component> | undefined | Custom edge type components |
| fitView | boolean | true | Auto-fit canvas to viewport |
| snapToGrid | boolean | false | Enable grid snapping |
| snapGrid | [number, number] | [15, 15] | Grid size for snapping |
| defaultViewport | Viewport | { x: 0, y: 0, zoom: 1 } | Initial viewport position |

---

### Controls

Zoom and pan control buttons.

```tsx
import { Controls } from 'workflow-canvas';

<Controls
  showZoom={true}
  showFitView={true}
  showInteractive={true}
  position="bottom-left"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showZoom | boolean | true | Show zoom in/out buttons |
| showFitView | boolean | true | Show fit view button |
| showInteractive | boolean | true | Show interactive toggle |
| position | 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' | 'bottom-left' | Control position |

---

### Minimap

Bird's eye view of the canvas.

```tsx
import { Minimap } from 'workflow-canvas';

<Minimap
  nodeColor="#e5e7eb"
  nodeStrokeColor="#9ca3af"
  nodeBorderRadius={4}
  position="bottom-right"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| nodeColor | string \| function | auto | Node color in minimap |
| nodeStrokeColor | string \| function | '#9ca3af' | Node border color |
| nodeBorderRadius | number | 4 | Node corner radius |
| position | 'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right' | 'bottom-right' | Minimap position |
| className | string | '' | Additional CSS classes |

---

## Prebuilt Nodes

### StartNode

Marks the beginning of a workflow.

```tsx
{
  id: '1',
  type: 'start',
  position: { x: 100, y: 100 },
  data: {
    label: 'Start',
    description: 'Begin workflow',
    color: '#10b981',
    icon: <PlayIcon />
  }
}
```

### EndNode

Marks the completion of a workflow.

```tsx
{
  id: '2',
  type: 'end',
  position: { x: 500, y: 100 },
  data: {
    label: 'End',
    description: 'Workflow complete',
    color: '#ef4444'
  }
}
```

### ActionNode

Executes an action or process.

```tsx
{
  id: '3',
  type: 'action',
  position: { x: 300, y: 100 },
  data: {
    label: 'Process',
    description: 'Transform data',
    color: '#3b82f6',
    onExecute: async (data) => {
      // Your logic here
      return result;
    }
  }
}
```

### ConditionalNode

Branches workflow based on conditions.

```tsx
{
  id: '4',
  type: 'conditional',
  position: { x: 300, y: 100 },
  data: {
    label: 'Check Status',
    description: 'Validate input',
    color: '#f59e0b'
  }
}
```

Outputs:
- `sourceHandle: 'true'` - Condition met
- `sourceHandle: 'false'` - Condition not met

### InputNode

Receives input data.

```tsx
{
  id: '5',
  type: 'input',
  position: { x: 100, y: 100 },
  data: {
    label: 'User Input',
    description: 'Collect data',
    color: '#8b5cf6'
  }
}
```

### OutputNode

Sends output data.

```tsx
{
  id: '6',
  type: 'output',
  position: { x: 500, y: 100 },
  data: {
    label: 'Result',
    description: 'Return data',
    color: '#ec4899'
  }
}
```

### ApiCallNode

Makes HTTP requests.

```tsx
{
  id: '7',
  type: 'apiCall',
  position: { x: 300, y: 100 },
  data: {
    label: 'Fetch Users',
    description: 'GET /api/users',
    color: '#06b6d4',
    config: {
      url: 'https://api.example.com/users',
      method: 'GET'
    }
  }
}
```

### TransformNode

Transforms or manipulates data.

```tsx
{
  id: '8',
  type: 'transform',
  position: { x: 300, y: 100 },
  data: {
    label: 'Format',
    description: 'Convert to JSON',
    color: '#14b8a6'
  }
}
```

---

## Hooks

### useWorkflow

Main hook for workflow operations.

```tsx
import { useWorkflow } from 'workflow-canvas';

function MyComponent() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    removeNode,
    updateNode,
    duplicateNode,
    createNode,
    deleteSelectedNodes,
    copySelectedNodes,
    pasteNodes
  } = useWorkflow();

  // Use these methods...
}
```

**Returns:**

| Method | Type | Description |
|--------|------|-------------|
| nodes | WorkflowNode[] | Current nodes |
| edges | WorkflowEdge[] | Current edges |
| setNodes | (nodes) => void | Set all nodes |
| setEdges | (edges) => void | Set all edges |
| addNode | (node) => void | Add single node |
| removeNode | (id) => void | Remove node by ID |
| updateNode | (id, data) => void | Update node data |
| duplicateNode | (id) => void | Duplicate node by ID |
| createNode | (type, data, position?) => WorkflowNode | Create new node |
| deleteSelectedNodes | () => void | Delete all selected nodes |
| copySelectedNodes | () => string[] | Copy selected node IDs |
| pasteNodes | (ids) => void | Paste nodes from IDs |

---

### useNodeRegistry

Manage available node types.

```tsx
import { useNodeRegistry } from 'workflow-canvas';

function NodePalette() {
  const {
    register,
    unregister,
    get,
    getAll,
    getAllByCategory,
    getTypes
  } = useNodeRegistry();
}
```

**Returns:**

| Method | Type | Description |
|--------|------|-------------|
| register | (type, component, config) => void | Register new node type |
| unregister | (type) => void | Remove node type |
| get | (type) => NodeRegistryItem \| undefined | Get single node type |
| getAll | () => NodeRegistryItem[] | Get all node types |
| getAllByCategory | (category) => NodeRegistryItem[] | Get nodes by category |
| getTypes | () => Record<string, Component> | Get node type map |

---

### useTheme

Access and modify theme.

```tsx
import { useTheme } from 'workflow-canvas';

function ThemeToggle() {
  const { theme, setTheme, updateTheme } = useTheme();

  const toggleDark = () => {
    updateTheme({
      nodeBackground: '#1f2937',
      nodeColor: '#f9fafb'
    });
  };
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| theme | WorkflowTheme | Current theme |
| setTheme | (theme) => void | Replace entire theme |
| updateTheme | (updates) => void | Partially update theme |

---

### useFlow

Access flow context.

```tsx
import { useFlow } from 'workflow-canvas';

function FlowInfo() {
  const {
    nodes,
    edges,
    addNode,
    removeNode,
    updateNode,
    nodeRegistry
  } = useFlow();
}
```

---

## Types

### WorkflowNode

```typescript
interface WorkflowNode extends Node<CustomNodeData> {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: CustomNodeData;
  selected?: boolean;
  width?: number;
  height?: number;
}
```

### CustomNodeData

```typescript
interface CustomNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  inputs?: number;
  outputs?: number;
  config?: Record<string, any>;
  onExecute?: (data: any) => Promise<any> | any;
  onChange?: (data: any) => void;
}
```

### WorkflowEdge

```typescript
interface WorkflowEdge extends Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  label?: string;
}
```

### WorkflowTheme

```typescript
interface WorkflowTheme {
  nodeBackground?: string;
  nodeBorder?: string;
  nodeColor?: string;
  nodeShadow?: string;
  handleBackground?: string;
  handleBorder?: string;
  primaryColor?: string;
  secondaryColor?: string;
}
```

### NodeConfig

```typescript
interface NodeConfig {
  id: string;
  type: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  category?: string;
  defaultData?: Record<string, any>;
}
```

---

## Providers

### ThemeProvider

Wrap your app to enable theming.

```tsx
import { ThemeProvider } from 'workflow-canvas';

<ThemeProvider initialTheme={customTheme}>
  <App />
</ThemeProvider>
```

### FlowProvider

Wrap your app to enable flow context (optional, usually not needed as FlowCanvas manages its own state).

```tsx
import { FlowProvider } from 'workflow-canvas';

<FlowProvider initialNodes={nodes} initialEdges={edges}>
  <App />
</FlowProvider>
```

### ReactFlowProvider

Required wrapper from reactflow for advanced features.

```tsx
import { ReactFlowProvider } from 'workflow-canvas';

<ReactFlowProvider>
  <FlowCanvas />
</ReactFlowProvider>
```

---

## Utilities

### nodeRegistry

Global node registry instance.

```tsx
import { nodeRegistry } from 'workflow-canvas';

nodeRegistry.register('custom', CustomNode, config);
nodeRegistry.get('custom');
nodeRegistry.getAll();
nodeRegistry.unregister('custom');
```

### Helper Functions

```tsx
import {
  generateId,
  getNodeCenter,
  copyNodes,
  getConnectedEdges,
  validateConnection,
  calculateNodePosition,
  groupNodesBySelection,
  calculateBoundingBox
} from 'workflow-canvas';
```
