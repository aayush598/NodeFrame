import React, { useState, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import {
  FlowCanvas,
  FlowcraftNode,
  FlowcraftEdge,
  ThemeProvider
} from '@flowcraft/canvas';

const initialNodes: FlowcraftNode[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 100, y: 150 },
    data: {
      label: 'Start Workflow',
      description: 'Initialize process',
      color: '#10b981'
    }
  },
  {
    id: '2',
    type: 'input',
    position: { x: 350, y: 50 },
    data: {
      label: 'User Input',
      description: 'Collect user data',
      color: '#8b5cf6'
    }
  },
  {
    id: '3',
    type: 'action',
    position: { x: 350, y: 150 },
    data: {
      label: 'Process Data',
      description: 'Transform input',
      color: '#3b82f6'
    }
  },
  {
    id: '4',
    type: 'conditional',
    position: { x: 600, y: 150 },
    data: {
      label: 'Validate',
      description: 'Check conditions',
      color: '#f59e0b'
    }
  },
  {
    id: '5',
    type: 'apiCall',
    position: { x: 850, y: 50 },
    data: {
      label: 'Save to API',
      description: 'POST /api/data',
      color: '#06b6d4'
    }
  },
  {
    id: '6',
    type: 'output',
    position: { x: 850, y: 250 },
    data: {
      label: 'Error Output',
      description: 'Handle errors',
      color: '#ec4899'
    }
  },
  {
    id: '7',
    type: 'transform',
    position: { x: 1100, y: 50 },
    data: {
      label: 'Format Response',
      description: 'JSON formatting',
      color: '#14b8a6'
    }
  },
  {
    id: '8',
    type: 'end',
    position: { x: 1350, y: 150 },
    data: {
      label: 'Complete',
      description: 'Workflow finished',
      color: '#ef4444'
    }
  }
];

const initialEdges: FlowcraftEdge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
  { id: 'e4-5', source: '4', target: '5', sourceHandle: 'true', animated: true, label: 'Valid' },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'false', animated: true, label: 'Invalid' },
  { id: 'e5-7', source: '5', target: '7', animated: true },
  { id: 'e7-8', source: '7', target: '8', animated: true },
  { id: 'e6-8', source: '6', target: '8', animated: true }
];

function App() {
  const [nodes, setNodes] = useState<FlowcraftNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowcraftEdge[]>(initialEdges);

  const handleNodesChange = useCallback((updatedNodes: FlowcraftNode[]) => {
    console.log('Nodes changed:', updatedNodes);
  }, []);

  const handleEdgesChange = useCallback((updatedEdges: FlowcraftEdge[]) => {
    console.log('Edges changed:', updatedEdges);
  }, []);

  const handleConnect = useCallback((connection: any) => {
    console.log('New connection:', connection);
  }, []);

  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <div style={{ width: '100vw', height: '100vh', background: '#f9fafb' }}>
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            background: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              NodeFrame Example
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#6b7280' }}>
              Try: Delete nodes (Del), Copy (Ctrl+C), Paste (Ctrl+V), Duplicate (Ctrl+D)
            </p>
          </div>

          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            showMinimap={true}
            showControls={true}
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView={true}
          />
        </div>
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

export default App;
