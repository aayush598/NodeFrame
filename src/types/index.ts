import type { Node, Edge, NodeProps } from '@reactflow/core';

export interface FlowcraftTheme {
  nodeBackground?: string;
  nodeBorder?: string;
  nodeColor?: string;
  nodeShadow?: string;
  handleBackground?: string;
  handleBorder?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface PropertyDefinition {
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'password';
  defaultValue?: any;
  options?: { label: string; value: any }[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: (value: any) => string | undefined;
}

export interface NodeConfig {
  id: string;
  type: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  category?: string;
  defaultData?: Record<string, any>;
  propertyDefinitions?: PropertyDefinition[];
  /**
   * Defines code generation logic for various platforms.
   * Key is the platform ID (e.g., 'github', 'jenkins').
   * Value is a function that returns the step configuration.
   */
  generators?: Record<string, (node: FlowcraftNode) => any>;
}

export interface CustomNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  inputs?: number;
  outputs?: number;
  config?: Record<string, any>;
  onExecute?: (inputs: any) => Promise<any> | any;
  onChange?: (data: any) => void;
  executionStatus?: 'idle' | 'executing' | 'success' | 'error';
  executionOutput?: any;
  executionError?: string;
  executionLogs?: string[];
  code?: string;
  properties?: Record<string, any>;
  // Grouping support
  isGroup?: boolean;
  subNodes?: FlowcraftNode[];
  subEdges?: FlowcraftEdge[];
  groupName?: string;
}

export type FlowcraftNode = Node<CustomNodeData>;
export type FlowcraftEdge = Edge;

export interface FlowcraftProps {
  nodes?: FlowcraftNode[];
  edges?: FlowcraftEdge[];
  onNodesChange?: (nodes: FlowcraftNode[]) => void;
  onEdgesChange?: (edges: FlowcraftEdge[]) => void;
  onConnect?: (connection: any) => void;
  theme?: FlowcraftTheme;
  showMinimap?: boolean;
  showControls?: boolean;
  showSidebar?: boolean;
  className?: string;
  nodeTypes?: Record<string, React.ComponentType<NodeProps>>;
  edgeTypes?: Record<string, any>;
  fitView?: boolean;
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  defaultViewport?: { x: number; y: number; zoom: number };
}

export interface NodeRegistryItem {
  type: string;
  component: React.ComponentType<NodeProps>;
  config: NodeConfig;
}

export interface FlowContextValue {
  nodes: FlowcraftNode[];
  edges: FlowcraftEdge[];
  setNodes: (nodes: any) => void;
  setEdges: (edges: any) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  addNode: (node: FlowcraftNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<CustomNodeData>) => void;
  duplicateNode: (id: string) => void;
  theme: FlowcraftTheme;
  nodeRegistry: Map<string, NodeRegistryItem>;
  registerNode: (type: string, component: React.ComponentType<NodeProps>, config: NodeConfig) => void;
  executeNode: (id: string) => Promise<void>;
  executeWorkflow: () => Promise<void>;
  groupNodes: (nodeIds: string[], name: string) => void;
  ungroupNode: (groupId: string) => void;
  copyNodes: (nodeIds: string[]) => void;
  pasteNodes: (position?: { x: number; y: number }) => void;
  deleteNodes: (nodeIds: string[]) => void;
  executionHistory: ExecutionRecord[];
  clearHistory: () => void;
  resetExecutionState: () => void;
  registerExporter: (exporter: CodeExporter) => void;
  exporters: CodeExporter[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onConnect: (connection: any) => void;
  onNodeDragStart: () => void;
}

export interface ExecutionRecord {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  totalNodes: number;
  details: Record<string, { status: string; output?: any; error?: string }>;
}

export interface CodeExporter {
  id: string;
  label: string;
  icon?: React.ReactNode;
  fileName: string;
  color?: string;
  generate: (nodes: FlowcraftNode[], edges: FlowcraftEdge[]) => string;
}
