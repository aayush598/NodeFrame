import { FlowcraftNode, FlowcraftEdge } from '../types';

export const generateId = (): string => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getNodeCenter = (node: FlowcraftNode): { x: number; y: number } => {
  return {
    x: (node.position?.x || 0) + ((node.width || 180) / 2),
    y: (node.position?.y || 0) + ((node.height || 80) / 2)
  };
};

export const copyNodes = (nodes: FlowcraftNode[], nodeIds: string[]): FlowcraftNode[] => {
  const nodesToCopy = nodes.filter(n => nodeIds.includes(n.id));
  const offset = 50;
  
  return nodesToCopy.map(node => ({
    ...node,
    id: generateId(),
    position: {
      x: node.position.x + offset,
      y: node.position.y + offset
    },
    selected: false
  }));
};

export const getConnectedEdges = (nodeId: string, edges: FlowcraftEdge[]): FlowcraftEdge[] => {
  return edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
};

export const validateConnection = (
  source: string,
  target: string,
  edges: FlowcraftEdge[]
): boolean => {
  if (source === target) return false;
  
  const existingConnection = edges.find(
    edge => edge.source === source && edge.target === target
  );
  
  return !existingConnection;
};

export const calculateNodePosition = (
  existingNodes: FlowcraftNode[],
  defaultPosition = { x: 100, y: 100 }
): { x: number; y: number } => {
  if (existingNodes.length === 0) return defaultPosition;
  
  const lastNode = existingNodes[existingNodes.length - 1];
  return {
    x: lastNode.position.x + 250,
    y: lastNode.position.y
  };
};

export const groupNodesBySelection = (nodes: FlowcraftNode[]): {
  selected: FlowcraftNode[];
  unselected: FlowcraftNode[];
} => {
  return nodes.reduce(
    (acc, node) => {
      if (node.selected) {
        acc.selected.push(node);
      } else {
        acc.unselected.push(node);
      }
      return acc;
    },
    { selected: [] as FlowcraftNode[], unselected: [] as FlowcraftNode[] }
  );
};

export const calculateBoundingBox = (nodes: FlowcraftNode[]): {
  x: number;
  y: number;
  width: number;
  height: number;
} => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const xs = nodes.map(n => n.position.x);
  const ys = nodes.map(n => n.position.y);
  const widths = nodes.map(n => (n.width || 180));
  const heights = nodes.map(n => (n.height || 80));

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs.map((x, i) => x + widths[i]));
  const maxY = Math.max(...ys.map((y, i) => y + heights[i]));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};
