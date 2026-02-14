import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Container, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const DockerBuildNode: React.FC<NodeProps<CustomNodeData>> = ({ id: _id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const imageName = data.properties?.imageName || 'my-app';
    const tags = data.properties?.tags || ['latest'];

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#0ea5e9') : undefined }}
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
                className="w-3 h-3 !bg-cyan-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#0ea5e9' }}
                >
                    {data.icon || <Container className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Docker Build'}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-1 truncate max-w-[140px]">
                        {imageName}
                    </div>
                </div>
            </div>

            {/* Tags Display */}
            <div className="mt-2 flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded font-mono">
                        :{tag}
                    </span>
                ))}
                {tags.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                        +{tags.length - 3}
                    </span>
                )}
            </div>

            {data.description && (
                <div className="text-xs text-gray-500 mt-2">{data.description}</div>
            )}

            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-cyan-500 !border-2 !border-white"
            />
        </div>
    );
};
