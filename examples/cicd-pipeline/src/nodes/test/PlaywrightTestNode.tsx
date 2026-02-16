import React from 'react';
import { NodeProps } from 'reactflow';
import { Theater } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PlaywrightTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Playwright Tests" icon={<Theater />} color="#10b981" />
);

export const config = {
    id: 'playwrightTests',
    type: 'playwrightTests',
    label: 'Playwright',
    category: 'Test',
    color: '#10b981',
    icon: <Theater size={16} />,

    generators: {
        github: () => ({ run: 'npx playwright test' }),
    },
};
