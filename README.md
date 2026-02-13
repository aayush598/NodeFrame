# @flowcraft/canvas

A professional React workflow canvas library with drag-drop, zoom, pan, minimap and customizable nodes - built on reactflow. Create visual workflow builders like n8n, Langflow, and VectorShift with minimal code.

## Features

- 🎨 **Beautiful Prebuilt Nodes** - Start, End, Action, Conditional, Input, Output, API Call, Transform nodes
- 🖱️ **Drag & Drop** - Intuitive node placement and connection
- 🔍 **Zoom & Pan** - Smooth canvas navigation with controls
- 🗺️ **Minimap** - Bird's eye view of your workflow
- ⌨️ **Keyboard Shortcuts** - Copy (Ctrl+C), Paste (Ctrl+V), Delete, Duplicate (Ctrl+D)
- 🎯 **Snap to Grid** - Precise node alignment
- 🎨 **Fully Customizable** - Custom nodes, themes, and styling
- 📦 **TypeScript** - Full type safety
- ⚡ **React 18+** - Built for modern React

## Installation

```bash
npm install @flowcraft/canvas
# or
yarn add @flowcraft/canvas
```

## Quick Start

```tsx
import React, { useState } from 'react';
import { FlowCanvas, FlowcraftNode, FlowcraftEdge } from '@flowcraft/canvas';

function App() {
  const [nodes, setNodes] = useState<FlowcraftNode[]>([
    {
      id: '1',
      type: 'start',
      position: { x: 100, y: 100 },
      data: { label: 'Start' }
    },
    {
      id: '2',
      type: 'action',
      position: { x: 300, y: 100 },
      data: { label: 'Process Data' }
    },
    {
      id: '3',
      type: 'end',
      position: { x: 500, y: 100 },
      data: { label: 'End' }
    }
  ]);

  const [edges, setEdges] = useState<FlowcraftEdge[]>([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' }
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

## Available Node Types

- `start` - Workflow start point
- `end` - Workflow end point
- `action` - Execute an action
- `conditional` - Branch based on condition
- `input` - Receive input data
- `output` - Send output data
- `apiCall` - Make API requests
- `transform` - Transform data

## Custom Nodes

Create your own custom nodes:

```tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '@flowcraft/canvas';

const MyCustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// Register custom node
<FlowCanvas
  nodeTypes={{ myCustom: MyCustomNode }}
  // ... other props
/>
```

## Theming

Customize the appearance:

```tsx
import { ThemeProvider } from '@flowcraft/canvas';

const customTheme = {
  nodeBackground: '#ffffff',
  nodeBorder: '#e5e7eb',
  nodeColor: '#1f2937',
  primaryColor: '#0ea5e9',
  secondaryColor: '#6366f1'
};

<ThemeProvider initialTheme={customTheme}>
  <FlowCanvas />
</ThemeProvider>
```

## Props

### FlowCanvas Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| nodes | FlowcraftNode[] | [] | Array of nodes |
| edges | FlowcraftEdge[] | [] | Array of edges |
| onNodesChange | (nodes) => void | - | Node change callback |
| onEdgesChange | (edges) => void | - | Edge change callback |
| onConnect | (connection) => void | - | Connection callback |
| showMinimap | boolean | true | Show minimap |
| showControls | boolean | true | Show zoom controls |
| snapToGrid | boolean | false | Enable grid snapping |
| snapGrid | [number, number] | [15, 15] | Grid size |
| nodeTypes | Record<string, Component> | - | Custom node types |
| theme | FlowcraftTheme | - | Custom theme |

## Keyboard Shortcuts

- **Delete/Backspace** - Delete selected nodes/edges
- **Ctrl+C** - Copy selected nodes
- **Ctrl+V** - Paste copied nodes
- **Ctrl+D** - Duplicate selected nodes

## Advanced Usage

### Using Hooks

```tsx
import { useFlowcraft } from '@flowcraft/canvas';

function MyComponent() {
  const { createNode, deleteSelectedNodes, nodes, edges } = useFlowcraft();

  const handleAddNode = () => {
    createNode('action', {
      label: 'New Action',
      description: 'Custom action'
    });
  };

  return <button onClick={handleAddNode}>Add Node</button>;
}
```

### Node Registry

```tsx
import { useNodeRegistry } from '@flowcraft/canvas';

function NodePalette() {
  const { getAll, getAllByCategory } = useNodeRegistry();

  const allNodes = getAll();
  
  return (
    <div>
      {allNodes.map(node => (
        <div key={node.type}>{node.config.label}</div>
      ))}
    </div>
  );
}
```

## License

MIT

## Author

FlowCraft Team

## Links

- [GitHub](https://github.com/flowcraft/canvas)
- [Documentation](https://flowcraft.dev/docs)
- [Examples](https://flowcraft.dev/examples)
