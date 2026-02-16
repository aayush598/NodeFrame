import React from 'react';
import { NodeProps } from 'reactflow';
import { Apple } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildIOSNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build iOS" icon={<Apple />} color="#f59e0b" />
);

export const config = {
    id: 'buildIOS',
    type: 'buildIOS',
    label: 'iOS',
    category: 'Build',
    color: '#f59e0b',
    icon: <Apple size={16} />,

    generators: {
        github: () => ({ run: 'xcodebuild -scheme App build' }),
    },
};
