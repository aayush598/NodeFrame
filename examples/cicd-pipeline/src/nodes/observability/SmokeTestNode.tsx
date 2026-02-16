import React from 'react';
import { NodeProps } from 'reactflow';
import { FlaskConical } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SmokeTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Smoke Test"}
            icon={<FlaskConical />}
            color="#a855f7"
        />
    );
};

export const config = {
    id: 'smokeTest',
    type: 'smokeTest',
    label: 'Smoke Test',
    category: 'Observability',
    color: '#a855f7',
    icon: <FlaskConical size={16} />,

    defaultData: {
        description: 'Run smoke tests post deployment',
        properties: {
            command: 'npm run smoke',
        },
    },

    propertyDefinitions: [
        { name: 'command', label: 'Command', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Smoke Test',
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
