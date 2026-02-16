import React from 'react';
import { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildDotnetNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title=".NET Build" icon={<Layers />} color="#f59e0b" />
);

export const config = {
    id: 'buildDotnet',
    type: 'buildDotnet',
    label: '.NET Build',
    category: 'Build',
    color: '#f59e0b',
    icon: <Layers size={16} />,

    generators: {
        github: () => ({ run: 'dotnet build --configuration Release' }),
    },
};
