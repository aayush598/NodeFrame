import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { CustomNodeData } from '../types';

export const ConditionalNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[180px] transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      style={{ borderColor: data.color || '#f59e0b' }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.color || '#f59e0b' }}
        >
          {data.icon || <GitBranch className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-900">{data.label || 'Condition'}</div>
          {data.description && (
            <div className="text-xs text-gray-500 mt-0.5">{data.description}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 !bg-green-500 !border-2 !border-white !top-[40%]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 !bg-red-500 !border-2 !border-white !top-[60%]"
      />
    </div>
  );
};
