import { Node, Edge, NodeProps } from 'reactflow';

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

export interface NodeConfig {
  id: string;
  type: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  category?: string;
  defaultData?: Record<string, any>;
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
  groupNodes: (nodeIds: string[]) => void;
  theme: FlowcraftTheme;
  nodeRegistry: Map<string, NodeRegistryItem>;
  registerNode: (type: string, component: React.ComponentType<NodeProps>, config: NodeConfig) => void;
  executeNode: (id: string) => Promise<void>;
  executeWorkflow: () => Promise<void>;
  executionHistory: ExecutionRecord[];
  clearHistory: () => void;
}

export interface ExecutionRecord {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  totalNodes: number;
  details: Record<string, { status: string; output?: any; error?: string }>;
}
