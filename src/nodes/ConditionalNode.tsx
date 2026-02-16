import { Handle, NodeProps, Position } from '@reactflow/core';
import { GitBranch } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const ConditionalNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data, isConnectable } = props;
  const { executeNode } = useWorkflowContext();

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

  const handles = (
    <>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-green-500 !border-2 !border-white !top-[40%]"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-red-500 !border-2 !border-white !top-[60%]"
      />
    </>
  );

  return (
    <BaseNode
      {...props}
      title={data.label || 'Condition'}
      icon={data.icon || <GitBranch />}
      color={data.color || '#f59e0b'}
      isSource={false}
      footer={
        <NodeActions
          status={data.executionStatus}
          onRun={handleRun}
          onCopyCode={handleCopyCode}
          className="!mt-0 !pt-0 !border-0"
        />
      }
      handles={handles}
    />
  );
};
