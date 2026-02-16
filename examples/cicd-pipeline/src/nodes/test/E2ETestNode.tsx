import React from 'react';
import { NodeProps } from 'reactflow';
import { Monitor } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const E2ETestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "E2E Tests"} icon={<Monitor />} color="#10b981" />
);

export const config = {
    id: 'e2eTests',
    type: 'e2eTests',
    label: 'E2E Tests',
    category: 'Test',
    color: '#10b981',
    icon: <Monitor size={16} />,

    generators: {
        github: () => ({ run: 'npm run test:e2e' }),
    },
};
