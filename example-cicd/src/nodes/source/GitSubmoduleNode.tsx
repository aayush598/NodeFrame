import React from 'react';
import { NodeProps } from 'reactflow';
import { Boxes } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const GitSubmoduleNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode {...props} title="Git Submodules" icon={<Boxes />} color="#3b82f6" />
    );
};

export const config = {
    id: 'gitSubmodules',
    type: 'gitSubmodules',
    label: 'Git Submodules',
    category: 'Source',
    color: '#3b82f6',
    icon: <Boxes size={16} />,

    generators: {
        github: () => ({
            run: 'git submodule update --init --recursive',
        }),

        gitlab: () => ({
            script: ['git submodule update --init --recursive'],
        }),

        jenkins: () => ([
            `sh 'git submodule update --init --recursive'`
        ]),
    },
};
