import React from 'react';
import { NodeProps } from 'reactflow';
import { HeartPulse } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const HealthCheckNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const url = props.data.properties?.url || '/health';

    return (
        <BaseNode
            {...props}
            title={data.label || "Health Check"}
            icon={<HeartPulse />}
            color="#22c55e"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {url}
                </span>
            }
        />
    );
};

export const config = {
    id: 'healthCheck',
    type: 'healthCheck',
    label: 'Health Check',
    category: 'Observability',
    color: '#22c55e',
    icon: <HeartPulse size={16} />,

    defaultData: {
        description: 'Verify service health endpoint',
        properties: {
            url: '',
            retries: 3,
        },
    },

    propertyDefinitions: [
        { name: 'url', label: 'Health URL', type: 'string' },
        { name: 'retries', label: 'Retries', type: 'number' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Health Check',
            run: `curl --retry ${n.data.properties.retries} ${n.data.properties.url}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `curl --retry ${n.data.properties.retries} ${n.data.properties.url}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'curl --retry ${n.data.properties.retries} ${n.data.properties.url}'`,
        ],
    },
};
