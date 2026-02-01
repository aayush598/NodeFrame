# Advanced Usage Guide

## Creating Custom Nodes

### Basic Custom Node

```tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CustomNodeData } from '@flowcraft/canvas';

export const DatabaseNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <span className="icon">🗄️</span>
        <span className="title">{data.label}</span>
      </div>
      {data.description && <p className="description">{data.description}</p>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
```

### Register Custom Node

```tsx
import { FlowCanvas } from '@flowcraft/canvas';
import { DatabaseNode } from './nodes/DatabaseNode';

function App() {
  return (
    <FlowCanvas
      nodeTypes={{
        database: DatabaseNode
      }}
      nodes={[
        {
          id: '1',
          type: 'database',
          position: { x: 100, y: 100 },
          data: {
            label: 'MySQL Database',
            description: 'Production DB'
          }
        }
      ]}
    />
  );
}
```

## Using Node Registry

The node registry allows you to manage and discover available nodes dynamically.

```tsx
import { useNodeRegistry, useFlowcraft } from '@flowcraft/canvas';
import { DatabaseNode } from './nodes/DatabaseNode';

function NodePalette() {
  const { register, getAll } = useNodeRegistry();
  const { createNode } = useFlowcraft();

  // Register a custom node
  React.useEffect(() => {
    register('database', DatabaseNode, {
      id: 'database',
      type: 'database',
      label: 'Database',
      category: 'storage',
      color: '#4ade80'
    });
  }, [register]);

  // Get all nodes
  const allNodes = getAll();

  return (
    <div className="node-palette">
      <h3>Available Nodes</h3>
      {allNodes.map(node => (
        <button
          key={node.type}
          onClick={() => createNode(node.type, { label: node.config.label })}
        >
          {node.config.label}
        </button>
      ))}
    </div>
  );
}
```

## Dynamic Node Creation

```tsx
import { useFlowcraft } from '@flowcraft/canvas';

function Toolbar() {
  const { createNode, nodes } = useFlowcraft();

  const handleAddNode = (type: string) => {
    // Automatically positions based on existing nodes
    createNode(type, {
      label: `New ${type}`,
      description: 'Added dynamically'
    });
  };

  return (
    <div className="toolbar">
      <button onClick={() => handleAddNode('action')}>Add Action</button>
      <button onClick={() => handleAddNode('conditional')}>Add Condition</button>
      <button onClick={() => handleAddNode('apiCall')}>Add API Call</button>
      <p>Total nodes: {nodes.length}</p>
    </div>
  );
}
```

## Custom Styling with Themes

```tsx
import { ThemeProvider, FlowCanvas } from '@flowcraft/canvas';

const darkTheme = {
  nodeBackground: '#1f2937',
  nodeBorder: '#374151',
  nodeColor: '#f9fafb',
  nodeShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
  handleBackground: '#3b82f6',
  handleBorder: '#2563eb',
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6'
};

function App() {
  return (
    <ThemeProvider initialTheme={darkTheme}>
      <FlowCanvas />
    </ThemeProvider>
  );
}
```

## Node Execution System

Add execution logic to your nodes:

```tsx
const nodes = [
  {
    id: '1',
    type: 'apiCall',
    position: { x: 100, y: 100 },
    data: {
      label: 'Fetch Users',
      config: {
        url: 'https://api.example.com/users',
        method: 'GET'
      },
      onExecute: async (data) => {
        const response = await fetch(data.config.url, {
          method: data.config.method
        });
        return await response.json();
      }
    }
  }
];

// Execute workflow
async function executeWorkflow(nodes, edges) {
  const startNode = nodes.find(n => n.type === 'start');
  
  const execute = async (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.data.onExecute) return null;
    
    const result = await node.data.onExecute(node.data);
    
    // Find connected nodes
    const connectedEdges = edges.filter(e => e.source === nodeId);
    for (const edge of connectedEdges) {
      await execute(edge.target);
    }
    
    return result;
  };
  
  return await execute(startNode.id);
}
```

## Validation and Connection Rules

```tsx
import { FlowCanvas } from '@flowcraft/canvas';

function App() {
  const validateConnection = (connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }
    
    // Prevent duplicate connections
    const exists = edges.some(
      e => e.source === connection.source && e.target === connection.target
    );
    
    return !exists;
  };

  return (
    <FlowCanvas
      onConnect={(connection) => {
        if (validateConnection(connection)) {
          // Add connection
          console.log('Valid connection', connection);
        } else {
          console.log('Invalid connection');
        }
      }}
    />
  );
}
```

## Grouping Nodes

```tsx
import { useFlowcraft } from '@flowcraft/canvas';

function GroupControls() {
  const { nodes, groupNodes } = useFlowcraft();

  const handleGroup = () => {
    const selectedIds = nodes
      .filter(n => n.selected)
      .map(n => n.id);
    
    if (selectedIds.length > 1) {
      groupNodes(selectedIds);
    }
  };

  return (
    <button onClick={handleGroup}>
      Group Selected Nodes
    </button>
  );
}
```

## Persisting Workflows

```tsx
import { useState, useEffect } from 'react';
import { FlowCanvas } from '@flowcraft/canvas';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('workflow');
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      setNodes(nodes);
      setEdges(edges);
    }
  }, []);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem('workflow', JSON.stringify({ nodes, edges }));
  };

  // Export as JSON
  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
  };

  return (
    <>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleExport}>Export</button>
      <FlowCanvas nodes={nodes} edges={edges} />
    </>
  );
}
```

## Full Example: Workflow Builder

```tsx
import React, { useState, useCallback } from 'react';
import {
  FlowCanvas,
  FlowcraftNode,
  FlowcraftEdge,
  ThemeProvider,
  ReactFlowProvider,
  useFlowcraft,
  useNodeRegistry
} from '@flowcraft/canvas';

function WorkflowBuilder() {
  const [nodes, setNodes] = useState<FlowcraftNode[]>([]);
  const [edges, setEdges] = useState<FlowcraftEdge[]>([]);
  const { createNode, deleteSelectedNodes } = useFlowcraft();
  const { getAll } = useNodeRegistry();

  const addNodeToCanvas = (type: string) => {
    createNode(type, {
      label: `New ${type}`,
      description: 'Configure this node'
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', padding: '20px', background: '#f3f4f6' }}>
        <h2>Node Palette</h2>
        {getAll().map(node => (
          <button
            key={node.type}
            onClick={() => addNodeToCanvas(node.type)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '5px 0',
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {node.config.label}
          </button>
        ))}
        <button
          onClick={deleteSelectedNodes}
          style={{
            marginTop: '20px',
            padding: '10px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Delete Selected
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <WorkflowBuilder />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
```
