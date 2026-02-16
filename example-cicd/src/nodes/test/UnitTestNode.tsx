import React from 'react';
import { NodeProps } from 'reactflow';
import { TestTube } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const UnitTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Unit Tests" icon={<TestTube />} color="#10b981" />
);

export const config = {
    id: 'unitTests',
    type: 'unitTests',
    label: 'Unit Tests',
    category: 'Test',
    color: '#10b981',
    icon: <TestTube size={16} />,

    generators: {
        github: () => ({ run: 'npm run test:unit' }),
    },
};
