import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { FlaskConical, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const TestRunnerNode: React.FC<NodeProps<CustomNodeData>> = ({ id: _id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const testType = data.properties?.testType || 'unit';
    const framework = data.properties?.framework || 'jest';
    const coverageEnabled = data.properties?.coverageEnabled === true;

    const typeColors: Record<string, string> = {
        unit: 'bg-purple-100 text-purple-700',
        integration: 'bg-orange-100 text-orange-700',
        e2e: 'bg-pink-100 text-pink-700',
    };

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#a855f7') : undefined }}
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
                className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#a855f7' }}
                >
                    {data.icon || <FlaskConical className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Run Tests'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${typeColors[testType] || typeColors.unit}`}>
                            {testType}
                        </span>
                        <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            {framework}
                        </span>
                        {coverageEnabled && (
                            <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                cov
                            </span>
                        )}
                    </div>
                </div>
            </div>



            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-purple-500 !border-2 !border-white"
            />
        </div>
    );
};
