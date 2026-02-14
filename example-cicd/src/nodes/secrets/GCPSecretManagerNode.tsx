import React from 'react';
import { NodeProps } from 'reactflow';
import { CloudCog } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const GCPSecretManagerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="GCP Secret Manager"
            icon={<CloudCog />}
            color="#34a853"
        />
    );
};

export const config = {
    id: 'gcpSecretManager',
    type: 'gcpSecretManager',
    label: 'GCP Secret Manager',
    category: 'Secrets',
    color: '#34a853',
    icon: <CloudCog size={16} />,

    defaultData: {
        description: 'Fetch secrets from Google Secret Manager',
        properties: {
            secretName: '',
        },
    },

    propertyDefinitions: [
        { name: 'secretName', label: 'Secret Name', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Fetch GCP Secret',
            run: `echo "Fetch GCP secret"`,
        }),
        gitlab: () => ({
            script: [`echo "Fetch GCP secret"`],
        }),
        jenkins: () => [`sh 'echo "Fetch GCP secret"'`],
    },
};
