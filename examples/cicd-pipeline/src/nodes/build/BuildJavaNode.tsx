import React from 'react';
import { NodeProps } from 'reactflow';
import { Coffee } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildJavaNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Java" icon={<Coffee />} color="#f59e0b" />
);

export const config = {
    id: 'buildJava',
    type: 'buildJava',
    label: 'Java Build',
    category: 'Build',
    color: '#f59e0b',
    icon: <Coffee size={16} />,

    generators: {
        github: () => ({ run: 'mvn package -B' }),
    },
};
