import React from 'react';
import { NodeProps } from 'reactflow';
import { KeyRound } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const AzureKeyVaultNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Azure Key Vault"}
            icon={<KeyRound />}
            color="#0078d4"
        />
    );
};

export const config = {
    id: 'azureKeyVault',
    type: 'azureKeyVault',
    label: 'Azure Key Vault',
    category: 'Secrets',
    color: '#0078d4',
    icon: <KeyRound size={16} />,

    defaultData: {
        description: 'Fetch secrets from Azure Key Vault',
        properties: {
            vaultName: '',
            secretName: '',
        },
    },

    propertyDefinitions: [
        { name: 'vaultName', label: 'Vault Name', type: 'string' },
        { name: 'secretName', label: 'Secret Name', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Fetch Azure Secret',
            run: `echo "Fetch Azure Key Vault secret"`,
        }),
        gitlab: () => ({
            script: [`echo "Fetch Azure Key Vault secret"`],
        }),
        jenkins: () => [`sh 'echo "Fetch Azure Key Vault secret"'`],
    },
};
