import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { useNodesState, useEdgesState, NodeProps } from 'reactflow';
import { FlowcraftNode, FlowcraftEdge, FlowContextValue, NodeConfig, ExecutionRecord, CustomNodeData } from '../types';
import { nodeRegistry } from '../utils/nodeRegistry';
import { generateId } from '../utils/helpers';

const FlowContext = createContext<FlowContextValue | undefined>(undefined);

export const FlowProvider: React.FC<{
  children: ReactNode;
  initialNodes?: FlowcraftNode[];
  initialEdges?: FlowcraftEdge[];
}> = ({ children, initialNodes = [], initialEdges = [] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([]);

  const addNode = useCallback((node: FlowcraftNode) => {
    setNodes(prev => [...prev, node]);
  }, [setNodes]);

  const removeNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
  }, [setNodes, setEdges]);

  const updateNode = useCallback((id: string, data: Partial<CustomNodeData>) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  }, [setNodes]);

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

  const updateNodeData = useCallback((id: string, updates: Partial<CustomNodeData>) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...updates } } : node
      )
    );
  }, [setNodes]);

  const getSourceNodeResults = useCallback((nodeId: string) => {
    const incomingEdges = edges.filter(e => e.target === nodeId);
    const results: Record<string, any> = {};

    incomingEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode && sourceNode.data.executionOutput !== undefined) {
        const key = edge.targetHandle || edge.sourceHandle || edge.source;
        results[key!] = sourceNode.data.executionOutput;
      }
    });

    return results;
  }, [nodes, edges]);

  const executeNode = useCallback(async (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    updateNodeData(nodeId, { executionStatus: 'executing' });

    try {
      const inputs = getSourceNodeResults(nodeId);
      let result;

      if (node.data.onExecute) {
        result = await node.data.onExecute(inputs);
      } else {
        result = { status: 'executed', timestamp: Date.now(), inputs };
      }

      updateNodeData(nodeId, {
        executionStatus: 'success',
        executionOutput: result,
        executionError: undefined
      });
      return result;
    } catch (error: any) {
      updateNodeData(nodeId, {
        executionStatus: 'error',
        executionError: error.message || 'Execution failed'
      });
      throw error;
    }
  }, [nodes, updateNodeData, getSourceNodeResults]);

  const clearHistory = useCallback(() => setExecutionHistory([]), []);

  const executeWorkflow = useCallback(async () => {
    const startTimeLocal = new Date().toLocaleString();
    const historyEntry: ExecutionRecord = {
      id: generateId(),
      timestamp: startTimeLocal,
      status: 'success',
      totalNodes: nodes.length,
      details: {}
    };

    setNodes(prev => prev.map(n => ({
      ...n,
      data: { ...n.data, executionStatus: 'idle', executionOutput: undefined, executionError: undefined }
    })));

    const startNodes = nodes.filter(node => !edges.some(e => e.target === node.id));
    const queue = [...startNodes];
    const executed = new Set<string>();
    let overallStatus: 'success' | 'error' = 'success';

    while (queue.length > 0) {
      const node = queue.shift();
      if (!node || executed.has(node.id)) continue;

      const parents = edges.filter(e => e.target === node.id).map(e => e.source);
      const allParentsExecuted = parents.every(p => executed.has(p));

      if (!allParentsExecuted && parents.length > 0) {
        queue.push(node);
        continue;
      }

      try {
        const result = await executeNode(node.id);
        executed.add(node.id);
        historyEntry.details[node.id] = { status: 'success', output: result };

        const children = edges.filter(e => e.source === node.id).map(e => e.target);
        children.forEach(childId => {
          const childNode = nodes.find(n => n.id === childId);
          if (childNode) queue.push(childNode);
        });
      } catch (e: any) {
        console.error(`Workflow execution stopped at node ${node.id}:`, e);
        historyEntry.details[node.id] = { status: 'error', error: e.message || 'Unknown error' };
        overallStatus = 'error';
        break;
      }
    }

    historyEntry.status = overallStatus;
    setExecutionHistory(prev => [historyEntry, ...prev]);
  }, [nodes, edges, executeNode, setNodes]);

  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange,
        addNode,
        removeNode,
        updateNode,
        duplicateNode,
        groupNodes,
        theme: {},
        nodeRegistry: (nodeRegistry as any).registry,
        registerNode,
        executeNode,
        executeWorkflow,
        executionHistory,
        clearHistory
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
