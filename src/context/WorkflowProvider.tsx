import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { addEdge, applyNodeChanges, applyEdgeChanges, type NodeProps, type Connection } from '@reactflow/core';
import { WorkflowNode, WorkflowEdge, WorkflowContextValue, NodeConfig, ExecutionRecord, CustomNodeData, CodeExporter } from '../types';
import { nodeRegistry } from '../utils/nodeRegistry';
import { generateId } from '../utils/helpers';

const WorkflowContext = createContext<WorkflowContextValue | undefined>(undefined);

export const WorkflowProvider: React.FC<{
  children: ReactNode;
  initialNodes?: WorkflowNode[];
  initialEdges?: WorkflowEdge[];
}> = ({ children, initialNodes = [], initialEdges = [] }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);
  const [executionHistory, setExecutionHistory] = useState<ExecutionRecord[]>([]);
  const [exporters, setExporters] = useState<CodeExporter[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  // Undo/Redo State
  const [past, setPast] = useState<Array<{ nodes: WorkflowNode[], edges: WorkflowEdge[] }>>([]);
  const [future, setFuture] = useState<Array<{ nodes: WorkflowNode[], edges: WorkflowEdge[] }>>([]);

  const takeSnapshot = useCallback(() => {
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };

    setPast(prev => {
      // Don't add if it's identical to the last state
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (JSON.stringify(last.nodes) === JSON.stringify(currentState.nodes) &&
          JSON.stringify(last.edges) === JSON.stringify(currentState.edges)) {
          return prev;
        }
      }
      return [...prev, currentState].slice(-50);
    });
    setFuture([]);
  }, [nodes, edges]);

  const onNodeDragStart = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture(prev => [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...prev]);
    setPast(newPast);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [past, nodes, edges]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setPast(prev => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setFuture(newFuture);
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [future, nodes, edges]);

  const onNodesChange = useCallback((changes: any) => {
    const hasRemoval = changes.some((c: any) => c.type === 'remove');
    if (hasRemoval) takeSnapshot();
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [takeSnapshot]);

  const onEdgesChange = useCallback((changes: any) => {
    const hasRemoval = changes.some((c: any) => c.type === 'remove');
    if (hasRemoval) takeSnapshot();
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [takeSnapshot]);

  const onConnect = useCallback((connection: Connection) => {
    takeSnapshot();
    setEdges((eds) => addEdge(connection, eds));
  }, [takeSnapshot]);

  const registerExporter = useCallback((exporter: CodeExporter) => {
    setExporters(prev => {
      const exists = prev.find(e => e.id === exporter.id);
      if (exists) return prev;
      return [...prev, exporter];
    });
  }, []);

  const addNode = useCallback((node: WorkflowNode) => {
    takeSnapshot();
    setNodes(prev => [...prev, node]);
  }, [setNodes, takeSnapshot]);

  const removeNode = useCallback((id: string) => {
    takeSnapshot();
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
  }, [setNodes, setEdges, takeSnapshot]);

  const deleteNodes = useCallback((nodeIds: string[]) => {
    takeSnapshot();
    setNodes(prev => prev.filter(n => !nodeIds.includes(n.id)));
    setEdges(prev => prev.filter(e => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)));
  }, [setNodes, setEdges, takeSnapshot]);

  const updateNode = useCallback((id: string, updates: Partial<CustomNodeData>) => {
    setNodes(prev =>
      prev.map(node => {
        if (node.id !== id) return node;
        return {
          ...node,
          data: {
            ...node.data,
            ...updates
          }
        };
      })
    );
  }, [setNodes]);

  const updateNodeProperty = useCallback((id: string, key: string, value: any) => {
    setNodes(prev =>
      prev.map(node => {
        if (node.id !== id) return node;
        const properties = { ...(node.data.properties || {}), [key]: value };
        return {
          ...node,
          data: {
            ...node.data,
            properties
          }
        };
      })
    );
  }, [setNodes]);

  const duplicateNode = useCallback((id: string) => {
    const nodeToDuplicate = nodes.find(n => n.id === id);
    if (!nodeToDuplicate) return;

    const newNode: WorkflowNode = {
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
    localStorage.setItem('workflow-canvas-clipboard', JSON.stringify({ nodes: selectedNodes, edges: selectedEdges }));
  }, [nodes, edges]);

  const pasteNodes = useCallback((position?: { x: number; y: number }) => {
    const clipboard = localStorage.getItem('workflow-canvas-clipboard');
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

    takeSnapshot();
    setNodes(prev => [...prev.map(n => ({ ...n, selected: false })), ...newNodes]);
    setEdges(prev => [...prev, ...newEdges]);
  }, [setNodes, setEdges, takeSnapshot]);

  const groupNodes = useCallback((nodeIds: string[], name: string) => {
    takeSnapshot();
    const nodesToGroup = nodes.filter(n => nodeIds.includes(n.id));
    if (nodesToGroup.length < 2) return;

    // Calculate bounding box
    const minX = Math.min(...nodesToGroup.map(n => n.position.x));
    const minY = Math.min(...nodesToGroup.map(n => n.position.y));

    const subEdges = edges.filter(e => nodeIds.includes(e.source) && nodeIds.includes(e.target));

    const groupNodeId = generateId();
    const groupNode: WorkflowNode = {
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
  }, [nodes, edges, setNodes, setEdges, takeSnapshot]);

  const ungroupNode = useCallback((groupId: string) => {
    takeSnapshot();
    const groupNode = nodes.find(n => n.id === groupId);
    if (!groupNode || !groupNode.data.isGroup) return;

    const { subNodes = [], subEdges = [] } = groupNode.data;

    // Restore external edges
    setEdges(prev => {
      const preservedEdges = prev.filter(e => e.source !== groupId && e.target !== groupId);
      const redirectedEdges = prev.filter(e => e.source === groupId || e.target === groupId).map(edge => {
        if (edge.source === groupId) {
          const originalSource = subNodes.find((sn: WorkflowNode) => !subEdges.some((se: WorkflowEdge) => se.source === sn.id));
          return { ...edge, source: originalSource?.id || subNodes[0].id };
        }
        if (edge.target === groupId) {
          const originalTarget = subNodes.find((sn: WorkflowNode) => !subEdges.some((se: WorkflowEdge) => se.target === sn.id));
          return { ...edge, target: originalTarget?.id || subNodes[0].id };
        }
        return edge;
      });
      return [...preservedEdges, ...redirectedEdges, ...subEdges];
    });

    setNodes(prev => [
      ...prev.filter(n => n.id !== groupId),
      ...subNodes.map((n: WorkflowNode) => ({ ...n, selected: true }))
    ]);
  }, [nodes, setNodes, setEdges, takeSnapshot]);

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

  const getSourceNodeResults = useCallback((nodeId: string, currentNodes: WorkflowNode[], currentEdges: WorkflowEdge[]) => {
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

  const executeNodeInternal = useCallback(async (nodeId: string, currentNodes: WorkflowNode[], currentEdges: WorkflowEdge[]) => {
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

  const resetExecutionState = useCallback(() => {
    takeSnapshot();
    setNodes(prev => prev.map(node => ({
      ...node,
      data: { ...node.data, executionStatus: 'idle', executionOutput: undefined, executionError: undefined }
    })));
  }, [takeSnapshot]);

  const clearHistory = useCallback(() => setExecutionHistory([]), []);

  const executeWorkflow = useCallback(async () => {
    // Flatten nodes for execution logic
    const flattenedNodes: WorkflowNode[] = [];
    const flattenedEdges: WorkflowEdge[] = [...edges];

    const expandGroup = (node: WorkflowNode) => {
      if (node.data.isGroup && node.data.subNodes) {
        node.data.subNodes.forEach((sn: WorkflowNode) => expandGroup(sn));
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
    <WorkflowContext.Provider
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
        updateNodeProperty,
        duplicateNode,
        groupNodes,
        ungroupNode,
        copyNodes,
        pasteNodes,
        deleteNodes,
        theme: {},
        nodeRegistry: (nodeRegistry as any).registry,
        getRegistryItem: (type: string) => nodeRegistry.get(type),
        registerNode,
        executeNode: (id) => executeNodeInternal(id, nodes, edges).then(() => { }),
        executeWorkflow,
        executionHistory,
        clearHistory,
        resetExecutionState,
        registerExporter,
        exporters,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        onConnect,
        onNodeDragStart,
        selectedPlatform,
        setSelectedPlatform
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflowContext = (): WorkflowContextValue => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflowContext must be used within WorkflowProvider');
  }
  return context;
};
