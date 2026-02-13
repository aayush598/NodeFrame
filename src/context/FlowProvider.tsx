import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { FlowcraftNode, FlowcraftEdge, FlowContextValue, NodeConfig } from '../types';
import { nodeRegistry } from '../utils/nodeRegistry';
import { generateId } from '../utils/helpers';
import { NodeProps } from 'reactflow';

const FlowContext = createContext<FlowContextValue | undefined>(undefined);

export const FlowProvider: React.FC<{
  children: ReactNode;
  initialNodes?: FlowcraftNode[];
  initialEdges?: FlowcraftEdge[];
}> = ({ children, initialNodes = [], initialEdges = [] }) => {
  const [nodes, setNodes] = useState<FlowcraftNode[]>(initialNodes);
  const [edges, setEdges] = useState<FlowcraftEdge[]>(initialEdges);

  const addNode = useCallback((node: FlowcraftNode) => {
    setNodes(prev => [...prev, node]);
  }, []);

  const removeNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
  }, []);

  const updateNode = useCallback((id: string, data: Partial<any>) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, []);

  const duplicateNode = useCallback((id: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === id);
    if (!nodeToDuplicate) return;

    const newNode: FlowcraftNode = {
      ...nodeToDuplicate,
      id: generateId(),
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50
      },
      selected: false
    };

    addNode(newNode);
  }, [nodes, addNode]);

  const groupNodes = useCallback((nodeIds: string[]) => {
    console.log('Grouping nodes:', nodeIds);
  }, []);

  const registerNode = useCallback(
    (type: string, component: React.ComponentType<NodeProps>, config: NodeConfig) => {
      nodeRegistry.register(type, component, config);
    },
    []
  );

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        addNode,
        removeNode,
        updateNode,
        duplicateNode,
        groupNodes,
        theme: {},
        nodeRegistry: nodeRegistry['registry'],
        registerNode
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = (): FlowContextValue => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider');
  }
  return context;
};
