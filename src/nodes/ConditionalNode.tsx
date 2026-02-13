import React from 'react';
import { Handle, NodeProps } from 'reactflow';
import { GitBranch, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useFlow } from '../context/FlowProvider';
import { NodeActions } from '../components/NodeActions';

export const ConditionalNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, selected, isConnectable }) => {
  const { executeNode } = useFlow();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Conditional Node Logic\nconst condition = inputs.value > 10;\nreturn condition;`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  const status = data.executionStatus || 'idle';

  return (
    <div
      className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[180px] transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
        } ${status === 'executing' ? 'node-executing' :
          status === 'success' ? 'node-success' :
            status === 'error' ? 'node-error' : ''
        }`}
      style={{ borderColor: status === 'idle' ? (data.color || '#f59e0b') : undefined }}
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
        position="left"
        isConnectable={isConnectable}
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

      <NodeActions
        status={data.executionStatus}
        onRun={handleRun}
        onCopyCode={handleCopyCode}
      />

      <Handle
        type="source"
        position="right"
        id="true"
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-green-500 !border-2 !border-white !top-[40%]"
      />
      <Handle
        type="source"
        position="right"
        id="false"
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-red-500 !border-2 !border-white !top-[60%]"
      />
    </div>
  );
};
