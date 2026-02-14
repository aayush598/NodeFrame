import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { Rocket, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '@nodeframe/types';

export const DeployNode: React.FC<NodeProps<CustomNodeData>> = ({ id: _id, data, selected, isConnectable }) => {
    const status = data.executionStatus || 'idle';
    const platform = data.properties?.platform || 'aws';
    const environment = data.properties?.environment || 'staging';
    const region = data.properties?.region || 'us-east-1';

    const platformColors: Record<string, string> = {
        aws: 'bg-orange-100 text-orange-700',
        vercel: 'bg-black text-white',
        kubernetes: 'bg-blue-100 text-blue-700',
        ssh: 'bg-gray-100 text-gray-700',
    };

    const envColors: Record<string, string> = {
        staging: 'bg-yellow-100 text-yellow-700',
        production: 'bg-red-100 text-red-700',
        development: 'bg-green-100 text-green-700',
    };

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                }`}
            style={{ borderColor: status === 'idle' ? (data.color || '#ec4899') : undefined }}
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
                className="w-3 h-3 !bg-pink-500 !border-2 !border-white"
            />

            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: data.color || '#ec4899' }}
                >
                    {data.icon || <Rocket className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{data.label || 'Deploy'}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${platformColors[platform] || platformColors.aws}`}>
                            {platform}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${envColors[environment] || envColors.staging}`}>
                            {environment}
                        </span>
                    </div>
                </div>
            </div>

            {region && (
                <div className="mt-2">
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                        {region}
                    </span>
                </div>
            )}



            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
                className="w-3 h-3 !bg-pink-500 !border-2 !border-white"
            />
        </div>
    );
};
