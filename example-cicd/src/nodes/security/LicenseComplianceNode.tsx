import React from 'react';
import { NodeProps } from 'reactflow';
import { Scale } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const LicenseComplianceNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="License Compliance" icon={<Scale />} color="#ef4444" />
);

export const config = {
    id: 'licenseCompliance',
    type: 'licenseCompliance',
    label: 'License Check',
    category: 'Security',
    color: '#ef4444',
    icon: <Scale size={16} />,

    generators: {
        github: () => ({ run: 'npx license-checker --production' }),
    },
};
