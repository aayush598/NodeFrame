import { useCallback } from 'react';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { WorkflowNode, CustomNodeData } from '../types';
import { generateId, calculateNodePosition } from '../utils/helpers';

export const useWorkflow = () => {
    const context = useWorkflowContext();

    const createNode = useCallback(
        (type: string, data: Partial<CustomNodeData> = {}, position?: { x: number; y: number }) => {
            const nodePosition = position || calculateNodePosition(context.nodes);

            const newNode: WorkflowNode = {
                id: generateId(),
                type,
                position: nodePosition,
                data: {
                    label: data.label || 'New Node',
                    ...data
                }
            };

            context.addNode(newNode);
            return newNode;
        },
        [context]
    );

    const deleteSelectedNodes = useCallback(() => {
        const selectedNodes = context.nodes.filter(n => n.selected);
        selectedNodes.forEach(node => context.removeNode(node.id));
    }, [context]);

    const copySelectedNodes = useCallback(() => {
        const selectedNodeIds = context.nodes.filter(n => n.selected).map(n => n.id);
        return selectedNodeIds;
    }, [context.nodes]);

    const pasteNodes = useCallback(
        (copiedNodeIds: string[]) => {
            const nodesToCopy = context.nodes.filter(n => copiedNodeIds.includes(n.id));
            nodesToCopy.forEach(node => {
                const newNode: WorkflowNode = {
                    ...node,
                    id: generateId(),
                    position: {
                        x: node.position.x + 50,
                        y: node.position.y + 50
                    },
                    selected: false
                };
                context.addNode(newNode);
            });
        },
        [context]
    );

    return {
        ...context,
        createNode,
        deleteSelectedNodes,
        copySelectedNodes,
        pasteNodes
    };
};
