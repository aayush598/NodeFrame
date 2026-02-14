import React from 'react';
import { NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ReleaseNotesGeneratorNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Release Notes"
            icon={<FileText />}
            color="#0ea5e9"
        />
    );
};

export const config = {
    id: 'releaseNotesGenerator',
    type: 'releaseNotesGenerator',
    label: 'Release Notes Generator',
    category: 'Release',
    color: '#0ea5e9',
    icon: <FileText size={16} />,

    defaultData: {
        description: 'Generate release notes from commits',
        properties: {
            format: 'markdown',
        },
    },

    propertyDefinitions: [
        {
            name: 'format',
            label: 'Format',
            type: 'select',
            options: [
                { label: 'Markdown', value: 'markdown' },
                { label: 'HTML', value: 'html' },
            ],
        },
    ],

    generators: {
        github: () => ({
            name: 'Generate Release Notes',
            run: `echo "Generate release notes"`,
        }),
        gitlab: () => ({
            script: [`echo "Generate release notes"`],
        }),
        jenkins: () => [`sh 'echo "Generate release notes"'`],
    },
};
