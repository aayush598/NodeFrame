import React from 'react';
import { NodeProps } from 'reactflow';
import { Coffee } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const PublishMavenNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Publish Maven" icon={<Coffee />} color="#14b8a6" />
);

export const config = {
    id: 'publishMaven',
    type: 'publishMaven',
    label: 'Publish Maven',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <Coffee size={16} />,

    generators: {
        github: () => ({ run: 'mvn deploy' }),
    },
};
