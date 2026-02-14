import React from 'react';
import { NodeProps } from 'reactflow';
import { HardDrive } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const GitLFSNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Git LFS Pull" icon={<HardDrive />} color="#3b82f6" />
);

export const config = {
    id: 'gitLfs',
    type: 'gitLfs',
    label: 'Git LFS',
    category: 'Source',
    color: '#3b82f6',
    icon: <HardDrive size={16} />,

    generators: {
        github: () => ({ run: 'git lfs pull' }),
        gitlab: () => ({ script: ['git lfs pull'] }),
        jenkins: () => ([`sh 'git lfs pull'`]),
    },
};
