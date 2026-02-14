import React from 'react';
import { NodeProps } from 'reactflow';
import { Leaf } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const BuildVueNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Vue" icon={<Leaf />} color="#f59e0b" />
);

export const config = {
    id: 'buildVue',
    type: 'buildVue',
    label: 'Vue',
    category: 'Build',
    color: '#f59e0b',
    icon: <Leaf size={16} />,

    generators: {
        github: () => ({ run: 'npm run build' }),
    },
};
