import React from 'react';
import { NodeProps } from 'reactflow';
import { Radar } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SyntheticMonitoringNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Synthetic Monitoring"}
            icon={<Radar />}
            color="#0ea5e9"
        />
    );
};

export const config = {
    id: 'syntheticMonitoring',
    type: 'syntheticMonitoring',
    label: 'Synthetic Monitoring',
    category: 'Observability',
    color: '#0ea5e9',
    icon: <Radar size={16} />,

    defaultData: {
        description: 'Run synthetic uptime checks',
        properties: {
            provider: 'checkly',
            url: '',
        },
    },

    propertyDefinitions: [
        { name: 'provider', label: 'Provider', type: 'string' },
        { name: 'url', label: 'Target URL', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Synthetic Monitoring',
            run: `echo "Run synthetic monitoring checks"`,
        }),
        gitlab: () => ({
            script: [`echo "Run synthetic monitoring checks"`],
        }),
        jenkins: () => [`sh 'echo "Run synthetic monitoring checks"'`],
    },
};
