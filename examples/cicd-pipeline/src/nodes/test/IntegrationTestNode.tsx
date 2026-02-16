import React from 'react';
import { NodeProps } from 'reactflow';
import { Network } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const IntegrationTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Integration Tests" icon={<Network />} color="#10b981" />
);

export const config = {
    id: 'integrationTests',
    type: 'integrationTests',
    label: 'Integration Tests',
    category: 'Test',
    color: '#10b981',
    icon: <Network size={16} />,

    generators: {
        github: () => ({ run: 'npm run test:integration' }),
    },
};
