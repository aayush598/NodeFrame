import React from 'react';
import { NodeProps } from 'reactflow';
import { Terminal } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ShellCommandNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const cmd = props.data.properties?.command || 'echo Hello';

    return (
        <BaseNode
            {...props}
            title="Shell Command"
            icon={<Terminal />}
            color="#111827"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    sh
                </span>
            }
        />
    );
};

export const config = {
    id: 'shellCommand',
    type: 'shellCommand',
    label: 'Shell Command',
    category: 'Utilities',
    color: '#111827',
    icon: <Terminal size={16} />,

    defaultData: {
        description: 'Execute shell command',
        properties: {
            command: 'echo "Hello World"',
        },
    },

    propertyDefinitions: [
        { name: 'command', label: 'Command', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Run Shell Command',
            run: n.data.properties.command,
        }),
        gitlab: (n: any) => ({
            script: [n.data.properties.command],
        }),
        jenkins: (n: any) => [
            `sh '${n.data.properties.command}'`,
        ],
    },
};
