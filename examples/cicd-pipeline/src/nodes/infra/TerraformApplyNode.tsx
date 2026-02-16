import React from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TerraformApplyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Terraform Apply"}
            icon={<Play />}
            color="#22c55e"
        />
    );
};

export const config = {
    id: 'terraformApply',
    type: 'terraformApply',
    label: 'Terraform Apply',
    category: 'Infrastructure',
    color: '#22c55e',
    icon: <Play size={16} />,

    defaultData: {
        description: 'Apply infrastructure changes',
        properties: {
            workingDir: './infra',
            autoApprove: true,
        },
    },

    propertyDefinitions: [
        { name: 'workingDir', label: 'Working Directory', type: 'string' },
        { name: 'autoApprove', label: 'Auto Approve', type: 'boolean' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Terraform Apply',
            run: `cd ${node.data.properties.workingDir} && terraform apply ${node.data.properties.autoApprove ? '-auto-approve' : ''}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `cd ${node.data.properties.workingDir}`,
                `terraform apply ${node.data.properties.autoApprove ? '-auto-approve' : ''}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'cd ${node.data.properties.workingDir} && terraform apply ${node.data.properties.autoApprove ? '-auto-approve' : ''}'`,
        ],
    },
};
