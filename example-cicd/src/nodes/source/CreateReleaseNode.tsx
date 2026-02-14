import React from 'react';
import { NodeProps } from 'reactflow';
import { Rocket } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const CreateReleaseNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Create Release" icon={<Rocket />} color="#3b82f6" />
);

export const config = {
    id: 'createRelease',
    type: 'createRelease',
    label: 'Create Release',
    category: 'Source',
    color: '#3b82f6',
    icon: <Rocket size={16} />,

    generators: {
        github: () => ({
            uses: 'softprops/action-gh-release@v2',
        }),

        gitlab: () => ({ script: ['echo "Create GitLab release"'] }),

        jenkins: () => ([`sh 'echo "Create release"'`]),
    },
};
