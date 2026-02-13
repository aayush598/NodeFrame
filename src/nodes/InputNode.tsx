import React from 'react';
import { Handle, NodeProps } from 'reactflow';
import { Download } from 'lucide-react';
import { CustomNodeData } from '../types';

export const InputNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected, isConnectable }) => {
  return (
    <div
      className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[180px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        }`}
      style={{ borderColor: data.color || '#8b5cf6' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.color || '#8b5cf6' }}
        >
          {data.icon || <Download className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-900">{data.label || 'Input'}</div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-0.5">{data.description}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position="right"
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
};
