import React from 'react';
import { NodeProps } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TypeCheckNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Type Check" icon={<CheckSquare />} color="#8b5cf6" />
);

export const config = {
    id: 'typeCheck',
    type: 'typeCheck',
    label: 'Type Check',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <CheckSquare size={16} />,

    generators: {
        github: () => ({ run: 'npm run typecheck' }),
    },
};
