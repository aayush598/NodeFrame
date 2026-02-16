import { NodeProps } from '@reactflow/core';
import { Upload } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const OutputNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data } = props;
  const { executeNode } = useWorkflowContext();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Output Node Logic\nconsole.log("Output data:", inputs);\nreturn { success: true };`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  return (
    <BaseNode
      {...props}
      title={data.label || 'Output'}
      icon={data.icon || <Upload />}
      color={data.color || '#ec4899'}
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
