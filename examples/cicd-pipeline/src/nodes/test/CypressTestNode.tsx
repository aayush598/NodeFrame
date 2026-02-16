import React from 'react';
import { NodeProps } from 'reactflow';
import { Eye } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CypressTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Cypress Tests"} icon={<Eye />} color="#10b981" />
);

export const config = {
    id: 'cypressTests',
    type: 'cypressTests',
    label: 'Cypress',
    category: 'Test',
    color: '#10b981',
    icon: <Eye size={16} />,

    generators: {
        github: () => ({ run: 'npx cypress run' }),
    },
};
