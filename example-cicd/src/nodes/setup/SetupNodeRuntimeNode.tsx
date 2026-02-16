import React from 'react';
import { NodeProps } from 'reactflow';
import { Cpu } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupNodeRuntimeNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const runtime = data.properties?.runtime || 'node';
    const version = data.properties?.version || '18';

    return (
        <BaseNode {...props} title="Setup Runtime" icon={<Cpu />} color="#6366f1">
            <div className="text-[10px]">{runtime}@{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupRuntime',
    type: 'setupRuntime',
    label: 'Setup Runtime',
    category: 'Setup',
    color: '#6366f1',
    icon: <Cpu size={16} />,

    defaultData: {
        properties: { runtime: 'node', version: '18' },
    },

    propertyDefinitions: [
        {
            name: 'runtime',
            label: 'Runtime',
            type: 'select',
            options: [
                { label: 'Node.js', value: 'node' },
                { label: 'Python', value: 'python' },
                { label: 'Java', value: 'java' },
                { label: 'Go', value: 'go' },
            ],
        },
        { name: 'version', label: 'Version', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: `actions/setup-${node.data.properties.runtime}@v4`,
            with: { version: node.data.properties.version },
        }),

        gitlab: () => ({ script: ['echo "Setup runtime"'] }),
        jenkins: () => ([`sh 'echo Setup runtime'`]),
    },
};
