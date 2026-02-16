import React from 'react';
import { NodeProps } from 'reactflow';
import { Activity } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const LoadTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Load Test" icon={<Activity />} color="#10b981" />
);

export const config = {
    id: 'loadTests',
    type: 'loadTests',
    label: 'Load Test',
    category: 'Test',
    color: '#10b981',
    icon: <Activity size={16} />,

    generators: {
        github: () => ({ run: 'k6 run load-test.js' }),
    },
};
