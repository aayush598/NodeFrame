import React from 'react';
import { NodeProps } from 'reactflow';
import { Brush } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const LintCodeNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const tool = data.properties?.tool || 'eslint';

    return (
        <BaseNode {...props} title="Lint Code" icon={<Brush />} color="#8b5cf6">
            <div className="text-[10px] uppercase">{tool}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'lintCode',
    type: 'lintCode',
    label: 'Lint Code',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Brush size={16} />,

    propertyDefinitions: [
        {
            name: 'tool',
            label: 'Lint Tool',
            type: 'select',
            options: [
                { label: 'ESLint', value: 'eslint' },
                { label: 'Biome', value: 'biome' },
                { label: 'TSLint', value: 'tslint' },
            ],
        },
    ],

    generators: {
        github: () => ({ run: 'npm run lint' }),
        gitlab: () => ({ script: ['npm run lint'] }),
        jenkins: () => ([`sh 'npm run lint'`]),
    },
};
