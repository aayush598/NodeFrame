import { NodeProps } from '@reactflow/core';
import { Box, Layers, Trash2 } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { BaseNode } from '../components/BaseNode';

export const GroupNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { id, data } = props;
    const { ungroupNode, deleteNodes, updateNode } = useWorkflowContext();

    const titleInput = (
        <input
            type="text"
            value={data.groupName || data.label || 'Group'}
            onChange={(e) => updateNode(id, { groupName: e.target.value })}
            className="font-bold text-sm text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        />
    );

    const subText = (
        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            {data.subNodes?.length || 0} Nodes Grouped
        </div>
    );

    const footer = (
        <div className="flex items-center justify-between gap-2">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    ungroupNode(id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 hover:bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold transition-all border border-gray-100 hover:border-purple-200"
                title="Explode/Ungroup"
            >
                <Layers size={12} />
                UNGROUP
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteNodes([id]);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            >
                <Trash2 size={14} />
            </button>
        </div>
    );

    return (
        <BaseNode
            {...props}
            title={titleInput}
            icon={<Box />}
            color="#9333ea" // purple-600
            headerRight={subText}
            footer={footer}
            className="min-w-[240px]" // Generally groups are wider
        />
    );
};
