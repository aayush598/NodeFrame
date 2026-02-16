import { NodeProps } from '@reactflow/core';
import { Zap } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const ActionNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data } = props;
  const { executeNode } = useWorkflowContext();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Action Node Logic\nconst result = await performAction(inputs);\nreturn result;`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  return (
    <BaseNode
      {...props}
      title={data.label || 'Action'}
      icon={data.icon || <Zap />}
      color={data.color || '#3b82f6'}
      footer={
        <NodeActions
          status={data.executionStatus}
          onRun={handleRun}
          onCopyCode={handleCopyCode}
          className="!mt-0 !pt-0 !border-0"
        />
      }
    />
  );
};
