import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { GitBranch, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const GitPushTriggerNode: React.FC<NodeProps<CustomNodeData>> = ({ id: _id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const branches = data.properties?.branches || ['main'];
    const eventType = data.properties?.eventType || 'push';

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#10b981') : undefined }}
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

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#10b981' }}
                >
                    {data.icon || <GitBranch className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Git Push Trigger'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] font-bold text-white bg-green-600 px-1.5 py-0.5 rounded uppercase">
                            {eventType}
                        </span>
                    </div>
                </div>
            </div>

            {/* Branch Display */}
            <div className="mt-2 flex flex-wrap gap-1">
                {branches.slice(0, 2).map((branch: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                        {branch}
                    </span>
                ))}
                {branches.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        +{branches.length - 2}
                    </span>
                )}
            </div>



            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-green-500 !border-2 !border-white"
            />
        </div>
    );
};
