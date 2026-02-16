import React from 'react';
import { NodeProps } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TerraformDestroyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Terraform Destroy"}
            icon={<Trash2 />}
            color="#ef4444"
        />
    );
};

export const config = {
    id: 'terraformDestroy',
    type: 'terraformDestroy',
    label: 'Terraform Destroy',
    category: 'Infrastructure',
    color: '#ef4444',
    icon: <Trash2 size={16} />,

    defaultData: {
        description: 'Destroy infrastructure',
        properties: {
            workingDir: './infra',
        },
    },

    propertyDefinitions: [
        { name: 'workingDir', label: 'Working Directory', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Terraform Destroy',
            run: `cd ${node.data.properties.workingDir} && terraform destroy -auto-approve`,
        }),
        gitlab: (node: any) => ({
            script: [
                `cd ${node.data.properties.workingDir}`,
                `terraform destroy -auto-approve`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'cd ${node.data.properties.workingDir} && terraform destroy -auto-approve'`,
        ],
    },
};
