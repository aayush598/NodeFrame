import React from 'react';
import { NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const SeleniumTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Selenium Tests" icon={<Bot />} color="#10b981" />
);

export const config = {
    id: 'seleniumTests',
    type: 'seleniumTests',
    label: 'Selenium',
    category: 'Test',
    color: '#10b981',
    icon: <Bot size={16} />,

    generators: {
        github: () => ({ run: 'mvn test' }),
    },
};
