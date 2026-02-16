import React from 'react';
import { NodeProps } from 'reactflow';
import { Coffee } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const MavenInstallNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Maven Install" icon={<Coffee />} color="#0ea5e9" />
);

export const config = {
    id: 'mavenInstall',
    type: 'mavenInstall',
    label: 'Maven Install',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Coffee size={16} />,

    generators: {
        github: () => ({ run: 'mvn install -B' }),
        gitlab: () => ({ script: ['mvn install -B'] }),
        jenkins: () => ([`sh 'mvn install -B'`]),
    },
};
