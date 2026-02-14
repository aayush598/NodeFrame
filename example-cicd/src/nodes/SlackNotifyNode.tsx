import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const SlackNotifyNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const channel = data.properties?.channel || '#general';
    const onlyOnFailure = data.properties?.onlyOnFailure === true;

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#6366f1') : undefined }}
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

            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-indigo-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#6366f1' }}
                >
                    {data.icon || <MessageSquare className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Slack Notify'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                            {channel}
                        </span>
                        {onlyOnFailure && (
                            <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">
                                ON FAIL
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {data.description && (
                <div className="text-xs text-gray-500 mt-2">{data.description}</div>
            )}

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-indigo-500 !border-2 !border-white"
            />
        </div>
    );
};
