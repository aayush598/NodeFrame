import React from 'react';
import { NodeProps } from 'reactflow';
import { BarChart3 } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PrometheusPushNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Prometheus Push"}
            icon={<BarChart3 />}
            color="#e11d48"
        />
    );
};

export const config = {
    id: 'prometheusPush',
    type: 'prometheusPush',
    label: 'Prometheus Push',
    category: 'Observability',
    color: '#e11d48',
    icon: <BarChart3 size={16} />,

    defaultData: {
        description: 'Push metrics to Prometheus Pushgateway',
        properties: {
            gatewayUrl: '',
            jobName: 'cicd_pipeline',
        },
    },

    propertyDefinitions: [
        { name: 'gatewayUrl', label: 'Gateway URL', type: 'string' },
        { name: 'jobName', label: 'Job Name', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Push Metrics',
            run: `echo "metric 1" | curl --data-binary @- ${n.data.properties.gatewayUrl}/metrics/job/${n.data.properties.jobName}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `echo "metric 1" | curl --data-binary @- ${n.data.properties.gatewayUrl}/metrics/job/${n.data.properties.jobName}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'echo "metric 1" | curl --data-binary @- ${n.data.properties.gatewayUrl}/metrics/job/${n.data.properties.jobName}'`,
        ],
    },
};
