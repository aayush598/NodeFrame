import React from 'react';
import { NodeProps } from 'reactflow';
import { ClipboardList } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TerraformPlanNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Terraform Plan"}
            icon={<ClipboardList />}
            color="#6366f1"
        />
    );
};

export const config = {
    id: 'terraformPlan',
    type: 'terraformPlan',
    label: 'Terraform Plan',
    category: 'Infrastructure',
    color: '#6366f1',
    icon: <ClipboardList size={16} />,

    defaultData: {
        description: 'Preview infrastructure changes',
        properties: {
            workingDir: './infra',
        },
    },

    propertyDefinitions: [
        { name: 'workingDir', label: 'Working Directory', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Terraform Plan',
            run: `cd ${node.data.properties.workingDir} && terraform plan`,
        }),
        gitlab: (node: any) => ({
            script: [
                `cd ${node.data.properties.workingDir}`,
                `terraform plan`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'cd ${node.data.properties.workingDir} && terraform plan'`,
        ],
    },
};
