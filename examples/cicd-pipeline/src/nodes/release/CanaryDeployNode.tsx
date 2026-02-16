import React from 'react';
import { NodeProps } from 'reactflow';
import { TrendingUp } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CanaryDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const pct = props.data.properties?.trafficPercent || 10;

    return (
        <BaseNode
            {...props}
            title={data.label || "Canary Deploy"}
            icon={<TrendingUp />}
            color="#f59e0b"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {pct}%
                </span>
            }
        />
    );
};

export const config = {
    id: 'canaryDeploy',
    type: 'canaryDeploy',
    label: 'Canary Deploy',
    category: 'Release',
    color: '#f59e0b',
    icon: <TrendingUp size={16} />,

    defaultData: {
        description: 'Gradual traffic rollout',
        properties: {
            trafficPercent: 10,
        },
    },

    propertyDefinitions: [
        { name: 'trafficPercent', label: 'Traffic %', type: 'number' },
    ],

    generators: {
        github: () => ({
            name: 'Canary Deploy',
            run: `echo "Canary deployment rollout"`,
        }),
        gitlab: () => ({
            script: [`echo "Canary deployment rollout"`],
        }),
        jenkins: () => [`sh 'echo "Canary deployment rollout"'`],
    },
};
