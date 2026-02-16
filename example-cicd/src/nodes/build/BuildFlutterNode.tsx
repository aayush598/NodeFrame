import React from 'react';
import { NodeProps } from 'reactflow';
import { Feather } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildFlutterNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Flutter" icon={<Feather />} color="#f59e0b" />
);

export const config = {
    id: 'buildFlutter',
    type: 'buildFlutter',
    label: 'Flutter',
    category: 'Build',
    color: '#f59e0b',
    icon: <Feather size={16} />,

    generators: {
        github: () => ({ run: 'flutter build apk' }),
    },
};
