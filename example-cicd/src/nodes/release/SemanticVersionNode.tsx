import React from 'react';
import { NodeProps } from 'reactflow';
import { GitCommit } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const SemanticVersionNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const type = props.data.properties?.releaseType || 'patch';

    return (
        <BaseNode
            {...props}
            title="Semantic Version"
            icon={<GitCommit />}
            color="#22c55e"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {type}
                </span>
            }
        />
    );
};

export const config = {
    id: 'semanticVersion',
    type: 'semanticVersion',
    label: 'Semantic Version',
    category: 'Release',
    color: '#22c55e',
    icon: <GitCommit size={16} />,

    defaultData: {
        description: 'Bump semantic version',
        properties: {
            releaseType: 'patch',
        },
    },

    propertyDefinitions: [
        {
            name: 'releaseType',
            label: 'Release Type',
            type: 'select',
            options: [
                { label: 'Major', value: 'major' },
                { label: 'Minor', value: 'minor' },
                { label: 'Patch', value: 'patch' },
            ],
        },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Bump Version',
            run: `npm version ${n.data.properties.releaseType}`,
        }),
        gitlab: (n: any) => ({
            script: [`npm version ${n.data.properties.releaseType}`],
        }),
        jenkins: (n: any) => [
            `sh 'npm version ${n.data.properties.releaseType}'`,
        ],
    },
};
