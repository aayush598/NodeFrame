import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  NodeTypes,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeSidebar } from './NodeSidebar';
import { RightSidebar } from './RightSidebar';
import { ShortcutsHelp } from './ShortcutsHelp';
import { useNodeRegistry } from '../hooks/useNodeRegistry';
import { ExportModal } from './ExportModal';
import { registerDefaultNodes } from '../utils/registerDefaultNodes';
import { nodeRegistry } from '../utils/nodeRegistry';
import { generateId } from '../utils/helpers';
import { FlowcraftProps } from '../types';
import { FlowProvider, useFlow } from '../context/FlowProvider';
import { FileCode, Play, RotateCcw, Copy, Clipboard, Trash2, Box, Undo2, Redo2 } from 'lucide-react';
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
import { GroupNode } from '../nodes/GroupNode';
import '../styles/index.css';

const defaultNodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  conditional: ConditionalNode,
  input: InputNode,
  output: OutputNode,
  apiCall: ApiCallNode,
  transform: TransformNode,
  group: GroupNode
};

const SelectionToolbar = () => {
  const { nodes, groupNodes, deleteNodes, copyNodes, pasteNodes } = useFlow();
  const selectedNodes = nodes.filter((n: any) => n.selected);
  const selectedNodeIds = selectedNodes.map((n: any) => n.id);

  if (selectedNodes.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl px-2 py-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <button
        onClick={() => copyNodes(selectedNodeIds)}
        className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors flex items-center gap-2 text-xs font-bold"
        title="Copy (Ctrl+C)"
      >
        <Copy size={16} />
      </button>
      <button
        onClick={() => pasteNodes()}
        className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors flex items-center gap-2 text-xs font-bold"
        title="Paste (Ctrl+V)"
      >
        <Clipboard size={16} />
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <button
        onClick={() => {
          const name = window.prompt('Enter Group Name:', 'Selected Logic');
          if (name) groupNodes(selectedNodeIds, name);
        }}
        disabled={selectedNodeIds.length < 2}
        className="px-3 py-1.5 hover:bg-purple-50 rounded-md text-purple-600 transition-colors flex items-center gap-2 text-xs font-bold disabled:opacity-30 disabled:hover:bg-transparent"
        title="Merge/Group Selection"
      >
        <Box size={16} />
        GROUP
      </button>
      <div className="w-px h-4 bg-gray-200 mx-1" />
      <button
        onClick={() => deleteNodes(selectedNodeIds)}
        className="p-2 hover:bg-red-50 rounded-md text-red-500 transition-colors flex items-center gap-2 text-xs font-bold"
        title="Delete Selection (Del)"
      >
        <Trash2 size={16} />
      </button>
      <div className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-500">
        {selectedNodeIds.length} SELECTED
      </div>
    </div>
  );
};

const WorkflowPanel = ({ exporters, onOpenExport }: { nNodes: number, nEdges: number, exporters: any[], onOpenExport: () => void }) => {
  const { executeWorkflow, resetExecutionState, undo, redo, canUndo, canRedo } = useFlow();

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 pr-3 border-r border-gray-100">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-sm font-bold text-gray-800 tracking-tight">NodeFrame</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-100 mx-1" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => executeWorkflow()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Play size={14} fill="currentColor" />
          RUN WORKFLOW
        </button>

        {exporters.length > 0 && (
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-md text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <FileCode size={14} />
            EXPORT CODE
          </button>
        )}

        <button
          onClick={resetExecutionState}
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

export const FlowCanvasInternal: React.FC<FlowcraftProps> = ({
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  onConnect: _onConnectProp,

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
    addNode,
    onNodesChange,
    onEdgesChange,
    deleteNodes,
    copyNodes,
    pasteNodes,
    exporters,
    undo,
    redo,
    onConnect,
    onNodeDragStart
  } = useFlow();

  const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    registerDefaultNodes();
  }, []);

  const { getAll } = useNodeRegistry();

  const nodeTypes = useMemo(() => {
    const registryTypes: Record<string, any> = {};
    getAll().forEach((item: any) => {
      registryTypes[item.type] = item.component;
    });
    return { ...defaultNodeTypes, ...registryTypes, ...customNodeTypes };
  }, [customNodeTypes, getAll]);

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


  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodesIDs = nodes.filter((node: any) => node.selected).map((n: any) => n.id);
        if (selectedNodesIDs.length > 0) {
          deleteNodes(selectedNodesIDs);
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const selectedNodesIDs = nodes.filter((node: any) => node.selected).map((n: any) => n.id);
        if (selectedNodesIDs.length > 0) {
          copyNodes(selectedNodesIDs);
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        pasteNodes();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'Z'))) {
        event.preventDefault();
        redo();
      }
    },
    [nodes, deleteNodes, copyNodes, pasteNodes, undo, redo]
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

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className={`flex w-full h-full overflow-hidden bg-gray-50 relative ${className}`}>
      {showSidebar && <NodeSidebar className="flex-shrink-0" />}
      <div
        className="flex-1 h-full relative min-w-0"
        ref={reactFlowWrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeDragStart={onNodeDragStart}
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
          selectionMode={'lasso' as any}
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Control"
          deleteKeyCode="Delete"
          panOnDrag={true}
          selectionOnDrag={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          {showControls && <Controls />}
          {showMinimap && <Minimap />}

          <Panel position="top-left" className="flex flex-col gap-2 pointer-events-auto">
            <WorkflowPanel
              onOpenExport={() => setIsExportModalOpen(true)}
              exporters={exporters}
              nNodes={nodes.length}
              nEdges={edges.length}
            />
          </Panel>

          <Panel position="bottom-center" className="pointer-events-auto">
            <SelectionToolbar />
          </Panel>

          <Panel position="top-right" className="pointer-events-auto mt-4 mr-4">
            <ShortcutsHelp />
          </Panel>
        </ReactFlow>
      </div>
      <div className="flex-shrink-0 h-full">
        <RightSidebar />
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        nodes={nodes}
        edges={edges}
        exporters={exporters}
      />
    </div>
  );
};
