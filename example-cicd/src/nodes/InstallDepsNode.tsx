import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const InstallDepsNode: React.FC<NodeProps<CustomNodeData>> = ({ id: _id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const packageManager = data.properties?.packageManager || 'npm';
    const cacheEnabled = data.properties?.cacheEnabled !== false;

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#3b82f6') : undefined }}
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
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#3b82f6' }}
                >
                    {data.icon || <Package className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Install Dependencies'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded uppercase">
                            {packageManager}
                        </span>
                        {cacheEnabled && (
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                cached
                            </span>
                        )}
                    </div>
                </div>
            </div>



            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
            />
        </div>
    );
};
