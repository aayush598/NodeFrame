import React from 'react';
import { NodeProps } from 'reactflow';
import { ShieldAlert } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SecurityScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const tool = data.properties?.tool || 'snyk';

    return (
        <BaseNode {...props} title={data.label || "Security Scan"} icon={<ShieldAlert />} color="#ef4444">
            <div className="text-[10px] uppercase">{tool}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'securityScan',
    type: 'securityScan',
    label: 'Security Scan',
    category: 'Security',
    color: '#ef4444',
    icon: <ShieldAlert size={16} />,

    propertyDefinitions: [
        {
            name: 'tool',
            label: 'Scanner',
            type: 'select',
            options: [
                { label: 'Snyk', value: 'snyk' },
                { label: 'Trivy', value: 'trivy' },
                { label: 'Semgrep', value: 'semgrep' },
            ],
        },
    ],

    generators: {
        github: (node: any) => ({
            run: `${node.data.properties.tool} scan`,
        }),

        gitlab: (node: any) => ({
            script: [`${node.data.properties.tool} scan`],
        }),

        jenkins: (node: any) => ([
            `sh '${node.data.properties.tool} scan'`,
        ]),
    },
};
