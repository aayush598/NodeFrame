import React from 'react';
import { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupPHPNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '8.2';

    return (
        <BaseNode {...props} title={data.label || "Setup PHP"} icon={<Code />} color="#6366f1">
            <div className="text-[10px]">{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupPHP',
    type: 'setupPHP',
    label: 'PHP',
    category: 'Setup',
    color: '#6366f1',
    icon: <Code size={16} />,
};
