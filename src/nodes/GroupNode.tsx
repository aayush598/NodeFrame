import { Handle, NodeProps, Position } from '@reactflow/core';
import { Box, Layers, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useFlow } from '../context/FlowProvider';

export const GroupNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, selected, isConnectable }) => {
    const { ungroupNode, deleteNodes, updateNode } = useFlow();
    const status = data.executionStatus || 'idle';

    return (
        <div
            className={`relative px-4 py-3 rounded-xl bg-white border-2 shadow-lg min-w-[200px] transition-all ${selected ? 'border-purple-500 ring-4 ring-purple-100' : 'border-purple-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
        >
            {/* Status Badge */}
            <div className={`status-badge ${status !== 'idle' ? 'visible' : ''} ${status === 'success' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                }`}>
                {status === 'executing' && <Loader2 className="w-3 h-3 text-white animate-spin" />}
                {status === 'success' && <CheckCircle className="w-3 h-3 text-white" />}
                {status === 'error' && <AlertCircle className="w-3 h-3 text-white" />}
            </div>

            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center shadow-inner">
                    <Box className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={data.groupName || data.label || 'Group'}
                            onChange={(e) => updateNode(id, { groupName: e.target.value })}
                            className="font-bold text-sm text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full"
                        />
                    </div>
                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                        {data.subNodes?.length || 0} Nodes Grouped
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2">
                <button
                    onClick={() => ungroupNode(id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-gray-50 hover:bg-purple-50 text-purple-600 rounded-md text-[10px] font-bold transition-all border border-gray-100 hover:border-purple-200"
                    title="Explode/Ungroup"
                >
                    <Layers size={12} />
                    UNGROUP
                </button>
                <button
                    onClick={() => deleteNodes([id])}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Default Handles (In Case Dynamic ones fails or for general flow) */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
            />
        </div>
    );
};
