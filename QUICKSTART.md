# Quick Start Guide

Get your workflow canvas running in 5 minutes!

## Installation

```bash
npm install workflow-canvas
# or
yarn add workflow-canvas
```

## Basic Setup

### 1. Simple Workflow (Minimal Code)

```tsx
import React from 'react';
import { FlowCanvas } from 'workflow-canvas';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowCanvas
        nodes={[
          {
            id: '1',
            type: 'start',
            position: { x: 100, y: 100 },
            data: { label: 'Start' }
          }
        ]}
      />
    </div>
  );
}

export default App;
```

**That's it!** You now have a working workflow canvas with:
- ✅ Drag & drop
- ✅ Zoom & pan
- ✅ Minimap
- ✅ Controls
- ✅ Keyboard shortcuts

---

## Complete Example

### 2. Interactive Workflow with State

```tsx
import React, { useState } from 'react';
import { FlowCanvas, WorkflowNode, WorkflowEdge } from 'workflow-canvas';

function App() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'start',
      position: { x: 100, y: 150 },
      data: { label: 'Start', color: '#10b981' }
    },
    {
      id: '2',
      type: 'action',
      position: { x: 350, y: 150 },
      data: { label: 'Process', color: '#3b82f6' }
    },
    {
      id: '3',
      type: 'end',
      position: { x: 600, y: 150 },
      data: { label: 'End', color: '#ef4444' }
    }
  ]);

  const [edges, setEdges] = useState<WorkflowEdge[]>([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true }
  ]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
      />
    </div>
  );
}

export default App;
```

---

## Available Node Types

Use these out of the box:

```tsx
// Start point
{ type: 'start', data: { label: 'Start' } }

// End point
{ type: 'end', data: { label: 'End' } }

// Action
{ type: 'action', data: { label: 'Process Data' } }

// Conditional (2 outputs)
{ type: 'conditional', data: { label: 'Check Status' } }

// Input
{ type: 'input', data: { label: 'Receive Data' } }

// Output
{ type: 'output', data: { label: 'Send Data' } }

// API Call
{ type: 'apiCall', data: { label: 'Fetch Users' } }

// Transform
{ type: 'transform', data: { label: 'Format JSON' } }
```

---

## Keyboard Shortcuts

Once running, use:

- **Delete/Backspace** - Delete selected nodes
- **Ctrl/Cmd + C** - Copy selected nodes
- **Ctrl/Cmd + V** - Paste nodes
- **Ctrl/Cmd + D** - Duplicate selected nodes
- **Mouse Wheel** - Zoom in/out
- **Click + Drag** - Pan canvas
- **Click Node + Drag** - Move node
- **Click Handle + Drag** - Connect nodes

---

## Customization

### Change Colors

```tsx
{
  id: '1',
  type: 'action',
  position: { x: 100, y: 100 },
  data: {
    label: 'Custom Node',
    description: 'With custom color',
    color: '#ff6b6b'  // Any hex color
  }
}
```

### Disable Minimap or Controls

```tsx
<FlowCanvas
  showMinimap={false}
  showControls={false}
/>
```

### Enable Grid Snapping

```tsx
<FlowCanvas
  snapToGrid={true}
  snapGrid={[20, 20]}
/>
```

---

## Common Patterns

### Adding Nodes Programmatically

```tsx
import { useWorkflow } from 'workflow-canvas';

function Toolbar() {
  const { createNode } = useWorkflow();

  return (
    <button onClick={() => createNode('action', { label: 'New Action' })}>
      Add Action Node
    </button>
  );
}
```

### Connecting Nodes

Users can connect by dragging from node handles, or programmatically:

```tsx
const [edges, setEdges] = useState([
  {
    id: 'edge-1',
    source: 'node-1',  // Source node ID
    target: 'node-2',  // Target node ID
    animated: true     // Optional animation
  }
]);
```

### Saving/Loading Workflows

```tsx
// Save
const handleSave = () => {
  localStorage.setItem('workflow', JSON.stringify({ nodes, edges }));
};

// Load
const handleLoad = () => {
  const data = localStorage.getItem('workflow');
  if (data) {
    const { nodes, edges } = JSON.parse(data);
    setNodes(nodes);
    setEdges(edges);
  }
};
```

---

## Full-Featured Example

Complete workflow builder with sidebar:

```tsx
import React, { useState } from 'react';
import {
  FlowCanvas,
  WorkflowNode,
  WorkflowEdge,
  ReactFlowProvider
} from 'workflow-canvas';

const nodeTypes = [
  { type: 'start', label: 'Start' },
  { type: 'action', label: 'Action' },
  { type: 'conditional', label: 'Condition' },
  { type: 'apiCall', label: 'API Call' },
  { type: 'end', label: 'End' }
];

function App() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: type }
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <div style={{
          width: '200px',
          padding: '20px',
          background: '#f3f4f6',
          borderRight: '1px solid #e5e7eb'
        }}>
          <h3>Add Nodes</h3>
          {nodeTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px',
                margin: '4px 0',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div style={{ flex: 1 }}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
```

---

## Next Steps

- 📖 Read [Advanced Guide](./ADVANCED.md) for custom nodes
- 📚 Check [API Reference](./API.md) for all options
- 💡 See [Example App](./example/) for complete implementation
- 🎨 Explore theming options
- 🔧 Create custom nodes for your use case

## Need Help?

Check out the included documentation:
- [API Reference](./API.md) - Complete API documentation
- [Advanced Guide](./ADVANCED.md) - Custom nodes and advanced features
- [Developer Guide](./DEVELOPER_GUIDE.md) - Architecture and best practices

---

Happy Building! 🚀
