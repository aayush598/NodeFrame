import React from 'react';
import { NodeProps } from 'reactflow';
import { Key } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const EnvInjectNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const keyName = props.data.properties?.key || 'ENV_VAR';

    return (
        <BaseNode
            {...props}
            title="Env Inject"
            icon={<Key />}
            color="#22c55e"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {keyName}
                </span>
            }
        />
    );
};

export const config = {
    id: 'envInject',
    type: 'envInject',
    label: 'Env Inject',
    category: 'Secrets',
    color: '#22c55e',
    icon: <Key size={16} />,

    defaultData: {
        description: 'Inject environment variable',
        properties: {
            key: '',
            value: '',
        },
    },

    propertyDefinitions: [
        { name: 'key', label: 'Key', type: 'string' },
        { name: 'value', label: 'Value', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Inject Env',
            run: `echo "${n.data.properties.key}=${n.data.properties.value}" >> $GITHUB_ENV`,
        }),
        gitlab: () => ({
            script: [`echo "Inject env variable"`],
        }),
        jenkins: () => [
            `sh 'echo "Inject env variable"'`,
        ],
    },
};
