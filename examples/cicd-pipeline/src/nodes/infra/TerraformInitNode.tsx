import React from 'react';
import { NodeProps } from 'reactflow';
import { Wrench } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TerraformInitNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Terraform Init"
            icon={<Wrench />}
            color="#8b5cf6"
        />
    );
};

export const config = {
    id: 'terraformInit',
    type: 'terraformInit',
    label: 'Terraform Init',
    category: 'Infrastructure',
    color: '#8b5cf6',
    icon: <Wrench size={16} />,

    defaultData: {
        description: 'Initialize Terraform workspace',
        properties: {
            workingDir: './infra',
        },
    },

    propertyDefinitions: [
        { name: 'workingDir', label: 'Working Directory', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Terraform Init',
            run: `cd ${node.data.properties.workingDir} && terraform init`,
        }),
        gitlab: (node: any) => ({
            script: [
                `cd ${node.data.properties.workingDir}`,
                `terraform init`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'cd ${node.data.properties.workingDir} && terraform init'`,
        ],
    },
};
