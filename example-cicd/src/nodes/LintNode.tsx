import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Gauge, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const LintNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const linter = data.properties?.linter || 'eslint';
    const autoFix = data.properties?.autoFix === true;

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#14b8a6') : undefined }}
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
                className="w-3 h-3 !bg-teal-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#14b8a6' }}
                >
                    {data.icon || <Gauge className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Lint Code'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-[9px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded uppercase">
                            {linter}
                        </span>
                        {autoFix && (
                            <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">
                                AUTO-FIX
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
                className="w-3 h-3 !bg-teal-500 !border-2 !border-white"
            />
        </div>
    );
};
