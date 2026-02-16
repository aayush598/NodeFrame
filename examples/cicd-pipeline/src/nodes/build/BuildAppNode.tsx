import React from 'react';
import { NodeProps } from 'reactflow';
import { Hammer } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildAppNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const tool = data.properties?.tool || 'vite';

    return (
        <BaseNode {...props} title={data.label || "Build App"} icon={<Hammer />} color="#f59e0b">
            <div className="text-[10px] uppercase">{tool}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'buildApp',
    type: 'buildApp',
    label: 'Build App',
    category: 'Build',
    color: '#f59e0b',
    icon: <Hammer size={16} />,

    defaultData: {
        properties: { tool: 'vite' },
    },

    propertyDefinitions: [
        {
            name: 'tool',
            label: 'Build Tool',
            type: 'select',
            options: [
                { label: 'Vite', value: 'vite' },
                { label: 'Webpack', value: 'webpack' },
                { label: 'Rollup', value: 'rollup' },
                { label: 'esbuild', value: 'esbuild' },
            ],
        },
    ],

    generators: {
        github: () => ({ run: 'npm run build' }),
        gitlab: () => ({ script: ['npm run build'] }),
        jenkins: () => ([`sh 'npm run build'`]),
    },
};
