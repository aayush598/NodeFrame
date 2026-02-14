import React from 'react';
import { NodeProps } from 'reactflow';
import { Wand2 } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const FormatCodeNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Format Code" icon={<Wand2 />} color="#8b5cf6" />
);

export const config = {
    id: 'formatCode',
    type: 'formatCode',
    label: 'Format Code',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Wand2 size={16} />,

    generators: {
        github: () => ({ run: 'npm run format' }),
    },
};
