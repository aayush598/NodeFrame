import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
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
import { FlowProvider, useFlow } from '../context/FlowProvider';
import { Play, RotateCcw } from 'lucide-react';
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

const WorkflowPanel = () => {
  const { executeWorkflow, setNodes } = useFlow();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 pr-3 border-r border-gray-100">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-sm font-bold text-gray-800 tracking-tight">NodeFrame</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => executeWorkflow()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Play size={14} fill="currentColor" />
          RUN WORKFLOW
        </button>
        <button
          onClick={() => {
            setNodes((nds: any) => nds.map((n: any) => ({
              ...n,
              data: { ...n.data, executionStatus: 'idle', executionOutput: undefined, executionError: undefined }
            })));
          }}
          title="Reset execution state"
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export const FlowCanvas: React.FC<FlowcraftProps> = (props) => {
  return (
    <FlowProvider initialNodes={props.nodes} initialEdges={props.edges}>
      <FlowCanvasInternal {...props} />
    </FlowProvider>
  );
};

const FlowCanvasInternal: React.FC<FlowcraftProps> = ({
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  onConnect: onConnectProp,

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
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange
  } = useFlow();

  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

  useEffect(() => {
    registerDefaultNodes();
  }, []);

  const nodeTypes = useMemo(() => {
    return { ...defaultNodeTypes, ...customNodeTypes };
  }, [customNodeTypes]);

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      if (onNodesChangeProp) {
        onNodesChangeProp(nodes);
      }
    },
    [onNodesChange, onNodesChangeProp, nodes]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      if (onEdgesChangeProp) {
        onEdgesChangeProp(edges);
      }
    },
    [onEdgesChange, onEdgesChangeProp, edges]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (onConnectProp) {
        onConnectProp(connection);
      }
    },
    [setEdges, onConnectProp]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodesIDs = nodes.filter((node) => node.selected).map(n => n.id);
        const selectedEdgesIDs = edges.filter((edge) => edge.selected).map(e => e.id);

        if (selectedNodesIDs.length > 0) {
          setNodes((nds: any) => nds.filter((node: any) => !node.selected));
        }
        if (selectedEdgesIDs.length > 0) {
          setEdges((eds: any) => eds.filter((edge: any) => !edge.selected));
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
          setNodes((nds: any) => [...nds, ...newNodes]);
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

      setNodes((nds: any) => nds.concat(newNode));
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
          <Panel position="top-left" className="flex flex-col gap-2 pointer-events-auto">
            <WorkflowPanel />
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};
