import React from 'react';
import { NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ChangelogGeneratorNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Generate Changelog" icon={<FileText />} color="#3b82f6" />
);

export const config = {
    id: 'changelogGenerator',
    type: 'changelogGenerator',
    label: 'Changelog',
    category: 'Source',
    color: '#3b82f6',
    icon: <FileText size={16} />,

    generators: {
        github: () => ({
            run: 'npx conventional-changelog -p angular -i CHANGELOG.md -s',
        }),

        gitlab: () => ({
            script: ['npx conventional-changelog -p angular -i CHANGELOG.md -s'],
        }),

        jenkins: () => ([
            `sh 'npx conventional-changelog -p angular -i CHANGELOG.md -s'`
        ]),
    },
};
