import React from 'react';
import { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ComposerInstallNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Composer Install"} icon={<Code />} color="#0ea5e9" />
);

export const config = {
    id: 'composerInstall',
    type: 'composerInstall',
    label: 'Composer Install',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Code size={16} />,

    generators: {
        github: () => ({ run: 'composer install --no-interaction' }),
        gitlab: () => ({ script: ['composer install --no-interaction'] }),
        jenkins: () => ([`sh 'composer install --no-interaction'`]),
    },
};
