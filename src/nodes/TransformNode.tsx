import { NodeProps } from '@reactflow/core';
import { Settings } from 'lucide-react';
import { CustomNodeData } from '../types';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { NodeActions } from '../components/NodeActions';
import { BaseNode } from '../components/BaseNode';

export const TransformNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { id, data } = props;
  const { executeNode } = useWorkflowContext();

  const handleRun = () => {
    executeNode(id);
  };

  const handleCopyCode = () => {
    if (data.code) {
      navigator.clipboard.writeText(data.code);
    } else {
      const defaultCode = `// Transform Node Logic\nconst transformed = {\n  ...inputs,\n  processedAt: Date.now(),\n  status: 'formatted'\n};\nreturn transformed;`;
      navigator.clipboard.writeText(defaultCode);
    }
  };

  return (
    <BaseNode
      {...props}
      title={data.label || 'Transform'}
      icon={data.icon || <Settings />}
      color={data.color || '#6366f1'}
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
