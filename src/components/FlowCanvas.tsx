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
import { NodeSidebar } from './NodeSidebar';
import { registerDefaultNodes } from '../utils/registerDefaultNodes';
import { nodeRegistry } from '../utils/nodeRegistry';
import { generateId } from '../utils/helpers';
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

  showMinimap = true,
  showControls = true,
  showSidebar = true,
  className = '',
  nodeTypes: customNodeTypes,
  edgeTypes,
  fitView = true,
  snapToGrid = false,
  snapGrid = [15, 15],
  defaultViewport = { x: 0, y: 0, zoom: 1 }
}) => {
  const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  useEffect(() => {
    registerDefaultNodes();
  }, []);

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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const registryItem = nodeRegistry.get(type);
      const newNode = {
        id: generateId(),
        type,
        position,
        data: {
          label: registryItem?.config.label || `${type} node`,
          ...registryItem?.config.defaultData
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className={`flex w-full h-full overflow-hidden ${className}`}>
      {showSidebar && <NodeSidebar />}
      <div
        className="flex-1 h-full relative"
        ref={reactFlowWrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
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
    </div>
  );
};
