import React from 'react';
import { NodeProps } from 'reactflow';
import { CloudCog } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ARMDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="ARM Deploy"
            icon={<CloudCog />}
            color="#0ea5e9"
        />
    );
};

export const config = {
    id: 'armDeploy',
    type: 'armDeploy',
    label: 'ARM Deploy',
    category: 'Infrastructure',
    color: '#0ea5e9',
    icon: <CloudCog size={16} />,

    defaultData: {
        description: 'Deploy Azure ARM template',
        properties: {
            resourceGroup: '',
            templateFile: 'template.json',
        },
    },

    propertyDefinitions: [
        { name: 'resourceGroup', label: 'Resource Group', type: 'string' },
        { name: 'templateFile', label: 'Template File', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'ARM Deploy',
            run: `az deployment group create --resource-group ${node.data.properties.resourceGroup} --template-file ${node.data.properties.templateFile}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `az deployment group create --resource-group ${node.data.properties.resourceGroup} --template-file ${node.data.properties.templateFile}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'az deployment group create --resource-group ${node.data.properties.resourceGroup} --template-file ${node.data.properties.templateFile}'`,
        ],
    },
};
