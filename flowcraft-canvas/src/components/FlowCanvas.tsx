import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowcraftProps } from '../types';
import { Controls } from './Controls';
import { Minimap } from './Minimap';
import { StartNode } from '../nodes/StartNode';
import { EndNode } from '../nodes/EndNode';
import { ActionNode } from '../nodes/ActionNode';
import { ConditionalNode } from '../nodes/ConditionalNode';
import { InputNode } from '../nodes/InputNode';
import { OutputNode } from '../nodes/OutputNode';
import { ApiCallNode } from '../nodes/ApiCallNode';
import { TransformNode } from '../nodes/TransformNode';
import '../styles/index.css';

const defaultNodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  conditional: ConditionalNode,
  input: InputNode,
  output: OutputNode,
  apiCall: ApiCallNode,
  transform: TransformNode
};

export const FlowCanvas: React.FC<FlowcraftProps> = ({
  nodes: initialNodes = [],
  edges: initialEdges = [],
  onNodesChange,
  onEdgesChange,
  onConnect,
  theme,
  showMinimap = true,
  showControls = true,
  className = '',
  nodeTypes: customNodeTypes,
  edgeTypes,
  fitView = true,
  snapToGrid = false,
  snapGrid = [15, 15],
  defaultViewport = { x: 0, y: 0, zoom: 1 }
}) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => {
    return { ...defaultNodeTypes, ...customNodeTypes };
  }, [customNodeTypes]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChangeInternal(changes);
      if (onNodesChange) {
        onNodesChange(nodes);
      }
    },
    [onNodesChangeInternal, onNodesChange, nodes]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChangeInternal(changes);
      if (onEdgesChange) {
        onEdgesChange(edges);
      }
    },
    [onEdgesChangeInternal, onEdgesChange, edges]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (onConnect) {
        onConnect(connection);
      }
    },
    [setEdges, onConnect]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((node) => !node.selected));
        }
        if (selectedEdges.length > 0) {
          setEdges((eds) => eds.filter((edge) => !edge.selected));
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          localStorage.setItem('flowcraft-clipboard', JSON.stringify(selectedNodes));
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        const clipboard = localStorage.getItem('flowcraft-clipboard');
        if (clipboard) {
          const copiedNodes = JSON.parse(clipboard);
          const newNodes = copiedNodes.map((node: any) => ({
            ...node,
            id: `${node.id}-copy-${Date.now()}`,
            position: {
              x: node.position.x + 50,
              y: node.position.y + 50
            },
            selected: false
          }));
          setNodes((nds) => [...nds, ...newNodes]);
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          const duplicatedNodes = selectedNodes.map((node) => ({
            ...node,
            id: `${node.id}-duplicate-${Date.now()}`,
            position: {
              x: node.position.x + 50,
              y: node.position.y + 50
            },
            selected: false
          }));
          setNodes((nds) => [...nds, ...duplicatedNodes]);
        }
      }
    },
    [nodes, edges, setNodes, setEdges]
  );

  return (
    <div className={`w-full h-full ${className}`} onKeyDown={handleKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={fitView}
        snapToGrid={snapToGrid}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        {showControls && <Controls />}
        {showMinimap && <Minimap />}
        <Panel position="top-left" className="bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">NodeFrame</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
