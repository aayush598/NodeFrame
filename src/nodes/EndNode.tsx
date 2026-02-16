import { NodeProps } from '@reactflow/core';
import { CheckCircle } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const EndNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data } = props;
  const { executeNode } = useWorkflowContext();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// End Node Logic\nconsole.log("Workflow Complete");\nreturn { completed: true };`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  return (
    <BaseNode
      {...props}
      title={data.label || 'End'}
      icon={data.icon || <CheckCircle />}
      color={data.color || '#ef4444'}
      isSource={false}
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
