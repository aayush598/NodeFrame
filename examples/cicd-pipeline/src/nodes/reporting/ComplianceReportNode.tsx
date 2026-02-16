import React from 'react';
import { NodeProps } from 'reactflow';
import { ShieldCheck } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ComplianceReportNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const standard = props.data.properties?.standard || 'SOC2';

    return (
        <BaseNode
            {...props}
            title="Compliance Report"
            icon={<ShieldCheck />}
            color="#16a34a"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {standard}
                </span>
            }
        />
    );
};

export const config = {
    id: 'complianceReport',
    type: 'complianceReport',
    label: 'Compliance Report',
    category: 'Reporting',
    color: '#16a34a',
    icon: <ShieldCheck size={16} />,

    defaultData: {
        description: 'Generate compliance audit report',
        properties: {
            standard: 'SOC2',
        },
    },

    propertyDefinitions: [
        {
            name: 'standard',
            label: 'Compliance Standard',
            type: 'select',
            options: [
                { label: 'SOC2', value: 'SOC2' },
                { label: 'ISO27001', value: 'ISO27001' },
                { label: 'HIPAA', value: 'HIPAA' },
                { label: 'GDPR', value: 'GDPR' },
            ],
        },
    ],

    generators: {
        github: () => ({
            name: 'Compliance Report',
            run: `echo "Generate compliance report"`,
        }),
        gitlab: () => ({
            script: [`echo "Generate compliance report"`],
        }),
        jenkins: () => [`sh 'echo "Generate compliance report"'`],
    },
};
