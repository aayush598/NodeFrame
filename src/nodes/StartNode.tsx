import { Handle, NodeProps, Position } from '@reactflow/core';
import { Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useFlow } from '../context/FlowProvider';
import { NodeActions } from '../components/NodeActions';

export const StartNode: React.FC<NodeProps<CustomNodeData>> = ({ id, data, selected, isConnectable }) => {
  const { executeNode } = useFlow();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Start Node Logic\nreturn { started: true, time: Date.now() };`;
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

      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.color || '#10b981' }}
        >
          {data.icon || <Play className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-900">{data.label || 'Start'}</div>
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
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />
    </div>
  );
};
