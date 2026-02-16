import { NodeProps } from '@reactflow/core';
import { Download } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const InputNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data } = props;
  const { executeNode } = useWorkflowContext();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Input Node Logic\nconst input = await collectUserInput();\nreturn input;`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  return (
    <BaseNode
      {...props}
      title={data.label || 'Input'}
      icon={data.icon || <Download />}
      color={data.color || '#8b5cf6'}
      isTarget={false}
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
