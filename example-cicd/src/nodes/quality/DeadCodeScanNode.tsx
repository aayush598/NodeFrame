import React from 'react';
import { NodeProps } from 'reactflow';
import { Skull } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DeadCodeScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Dead Code Scan" icon={<Skull />} color="#8b5cf6" />
);

export const config = {
    id: 'deadCodeScan',
    type: 'deadCodeScan',
    label: 'Dead Code',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Skull size={16} />,

    generators: {
        github: () => ({ run: 'npx depcheck' }),
    },
};
