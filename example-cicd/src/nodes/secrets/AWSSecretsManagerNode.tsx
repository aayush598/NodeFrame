import React from 'react';
import { NodeProps } from 'reactflow';
import { Cloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const AWSSecretsManagerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const name = props.data.properties?.secretName || '';

    return (
        <BaseNode
            {...props}
            title="AWS Secrets"
            icon={<Cloud />}
            color="#ff9900"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {name}
                </span>
            }
        />
    );
};

export const config = {
    id: 'awsSecretsManager',
    type: 'awsSecretsManager',
    label: 'AWS Secrets Manager',
    category: 'Secrets',
    color: '#ff9900',
    icon: <Cloud size={16} />,

    defaultData: {
        description: 'Fetch secrets from AWS Secrets Manager',
        properties: {
            secretName: '',
            region: 'us-east-1',
        },
    },

    propertyDefinitions: [
        { name: 'secretName', label: 'Secret Name', type: 'string' },
        { name: 'region', label: 'Region', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Fetch AWS Secret',
            run: `aws secretsmanager get-secret-value --secret-id ${n.data.properties.secretName} --region ${n.data.properties.region}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `aws secretsmanager get-secret-value --secret-id ${n.data.properties.secretName} --region ${n.data.properties.region}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'aws secretsmanager get-secret-value --secret-id ${n.data.properties.secretName} --region ${n.data.properties.region}'`,
        ],
    },
};
