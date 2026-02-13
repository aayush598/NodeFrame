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

  const deleteNodes = useCallback((nodeIds: string[]) => {
    setNodes(prev => prev.filter(n => !nodeIds.includes(n.id)));
    setEdges(prev => prev.filter(e => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)));
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

  const copyNodes = useCallback((nodeIds: string[]) => {
    const selectedNodes = nodes.filter(n => nodeIds.includes(n.id));
    const selectedEdges = edges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));
    localStorage.setItem('nodeframe-clipboard', JSON.stringify({ nodes: selectedNodes, edges: selectedEdges }));
  }, [nodes, edges]);

  const pasteNodes = useCallback((position?: { x: number; y: number }) => {
    const clipboard = localStorage.getItem('nodeframe-clipboard');
    if (!clipboard) return;

    const { nodes: copiedNodes, edges: copiedEdges } = JSON.parse(clipboard);
    const idMap: Record<string, string> = {};

    const newNodes = copiedNodes.map((node: any) => {
      const newId = generateId();
      idMap[node.id] = newId;
      return {
        ...node,
        id: newId,
        position: position ? {
          x: node.position.x + (position.x - copiedNodes[0].position.x),
          y: node.position.y + (position.y - copiedNodes[0].position.y)
        } : {
          x: node.position.x + 50,
          y: node.position.y + 50
        },
        selected: true
      };
    });

    const newEdges = copiedEdges.map((edge: any) => ({
      ...edge,
      id: generateId(),
      source: idMap[edge.source],
      target: idMap[edge.target]
    }));

    setNodes(prev => [...prev.map(n => ({ ...n, selected: false })), ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
  }, [setNodes, setEdges]);

  const groupNodes = useCallback((nodeIds: string[], name: string) => {
    const nodesToGroup = nodes.filter(n => nodeIds.includes(n.id));
    if (nodesToGroup.length < 2) return;

    // Calculate bounding box
    const minX = Math.min(...nodesToGroup.map(n => n.position.x));
    const minY = Math.min(...nodesToGroup.map(n => n.position.y));

    const subEdges = edges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));

    const groupNodeId = generateId();
    const groupNode: FlowcraftNode = {
      id: groupNodeId,
      type: 'group',
      position: { x: minX, y: minY },
      data: {
        label: name,
        groupName: name,
        isGroup: true,
        subNodes: nodesToGroup,
        subEdges: subEdges,
        color: '#9333ea'
      }
    };

    // Redirect external edges
    setEdges(prev => prev.map(edge => {
      if (nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)) {
        return { ...edge, source: groupNodeId };
      }
      if (nodeIds.includes(edge.target) && !nodeIds.includes(edge.source)) {
        return { ...edge, target: groupNodeId };
      }
      return edge;
    }).filter(edge => !subEdges.some(se => se.id === edge.id)));

    setNodes(prev => [
      ...prev.filter(n => !nodeIds.includes(n.id)),
      groupNode
    ]);
  }, [nodes, edges, setNodes, setEdges]);

  const ungroupNode = useCallback((groupId: string) => {
    const groupNode = nodes.find(n => n.id === groupId);
    if (!groupNode || !groupNode.data.isGroup) return;

    const { subNodes = [], subEdges = [] } = groupNode.data;

    // Restore external edges
    setEdges(prev => {
      const preservedEdges = prev.filter(e => e.source !== groupId && e.target !== groupId);
      const redirectedEdges = prev.filter(e => e.source === groupId || e.target === groupId).map(edge => {
        if (edge.source === groupId) {
          const originalSource = subNodes.find((sn: FlowcraftNode) => !subEdges.some((se: FlowcraftEdge) => se.source === sn.id));
          return { ...edge, source: originalSource?.id || subNodes[0].id };
        }
        if (edge.target === groupId) {
          const originalTarget = subNodes.find((sn: FlowcraftNode) => !subEdges.some((se: FlowcraftEdge) => se.target === sn.id));
          return { ...edge, target: originalTarget?.id || subNodes[0].id };
        }
        return edge;
      });
      return [...preservedEdges, ...redirectedEdges, ...subEdges];
    });

    setNodes(prev => [
      ...prev.filter(n => n.id !== groupId),
      ...subNodes.map((n: FlowcraftNode) => ({ ...n, selected: true }))
    ]);
  }, [nodes, setNodes, setEdges]);

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

  const getSourceNodeResults = useCallback((nodeId: string, currentNodes: FlowcraftNode[], currentEdges: FlowcraftEdge[]) => {
    const incomingEdges = currentEdges.filter(e => e.target === nodeId);
    const results: Record<string, any> = {};

    incomingEdges.forEach(edge => {
      const sourceNode = currentNodes.find(n => n.id === edge.source);
      if (sourceNode && sourceNode.data.executionOutput !== undefined) {
        const key = edge.targetHandle || edge.sourceHandle || edge.source;
        results[key!] = sourceNode.data.executionOutput;
      }
    });

    return results;
  }, []);

  const executeNodeInternal = useCallback(async (nodeId: string, currentNodes: FlowcraftNode[], currentEdges: FlowcraftEdge[]) => {
    const node = currentNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Update status for visual feedback (if it's a top-level node)
    updateNodeData(nodeId, { executionStatus: 'executing' });

    try {
      const inputs = getSourceNodeResults(nodeId, currentNodes, currentEdges);
      let result;

      if (node.data.onExecute) {
        result = await node.data.onExecute(inputs);
      } else {
        result = { status: 'executed', timestamp: Date.now(), inputs };
      }

      node.data.executionOutput = result; // Mutate for internal flat tracking
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
  }, [updateNodeData, getSourceNodeResults]);

  const clearHistory = useCallback(() => setExecutionHistory([]), []);

  const executeWorkflow = useCallback(async () => {
    // Flatten nodes for execution logic
    const flattenedNodes: FlowcraftNode[] = [];
    const flattenedEdges: FlowcraftEdge[] = [...edges];

    const expandGroup = (node: FlowcraftNode) => {
      if (node.data.isGroup && node.data.subNodes) {
        node.data.subNodes.forEach(sn => expandGroup(sn));
        if (node.data.subEdges) flattenedEdges.push(...node.data.subEdges);
        // Also need to find edges connecting to the group and map them to subnodes
        // For simplicity in this implementation, we treat the group as a unit or assume internal connectivity is valid
        flattenedNodes.push(node); // Execute the group shell too
      } else {
        flattenedNodes.push(node);
      }
    };

    nodes.forEach(n => expandGroup(n));

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
        // If it's a group, we should actually execute sub-workflow
        if (node.data.isGroup && node.data.subNodes) {
          updateNodeData(node.id, { executionStatus: 'executing' });
          // Flat execution for group: just mark it success for now, or execute a sub-runner
          // In a real scenario, we'd run the sub-nodes. Here we just mock group completion.
          await new Promise(r => setTimeout(r, 500));
          historyEntry.details[node.id] = { status: 'success', output: { grouped: true } };
          updateNodeData(node.id, { executionStatus: 'success', executionOutput: { grouped: true } });
        } else {
          const result = await executeNodeInternal(node.id, nodes, edges);
          historyEntry.details[node.id] = { status: 'success', output: result };
        }

        executed.add(node.id);

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
  }, [nodes, edges, executeNodeInternal, setNodes, updateNodeData]);

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
        ungroupNode,
        copyNodes,
        pasteNodes,
        deleteNodes,
        theme: {},
        nodeRegistry: (nodeRegistry as any).registry,
        registerNode,
        executeNode: (id) => executeNodeInternal(id, nodes, edges).then(() => { }),
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
