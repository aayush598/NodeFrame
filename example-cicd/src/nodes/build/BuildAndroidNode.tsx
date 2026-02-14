import React from 'react';
import { NodeProps } from 'reactflow';
import { Smartphone } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const BuildAndroidNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Android" icon={<Smartphone />} color="#f59e0b" />
);

export const config = {
    id: 'buildAndroid',
    type: 'buildAndroid',
    label: 'Android',
    category: 'Build',
    color: '#f59e0b',
    icon: <Smartphone size={16} />,

    generators: {
        github: () => ({ run: './gradlew assembleRelease' }),
    },
};
