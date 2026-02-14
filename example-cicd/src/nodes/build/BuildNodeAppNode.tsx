import React from 'react';
import { NodeProps } from 'reactflow';
import { Server } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const BuildNodeAppNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Node App" icon={<Server />} color="#f59e0b" />
);

export const config = {
    id: 'buildNodeApp',
    type: 'buildNodeApp',
    label: 'Node App',
    category: 'Build',
    color: '#f59e0b',
    icon: <Server size={16} />,

    generators: {
        github: () => ({ run: 'npm run build' }),
    },
};
