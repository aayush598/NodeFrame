import React from 'react';
import { NodeProps } from 'reactflow';
import { Globe } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const BuildNextJSNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Next.js" icon={<Globe />} color="#f59e0b" />
);

export const config = {
    id: 'buildNextJS',
    type: 'buildNextJS',
    label: 'Next.js',
    category: 'Build',
    color: '#f59e0b',
    icon: <Globe size={16} />,

    generators: {
        github: () => ({ run: 'npm run build' }),
    },
};
