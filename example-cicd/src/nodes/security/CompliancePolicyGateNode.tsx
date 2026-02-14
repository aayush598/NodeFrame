import React from 'react';
import { NodeProps } from 'reactflow';
import { ShieldCheck } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const CompliancePolicyGateNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const policy = data.properties?.policy || 'default';

    return (
        <BaseNode {...props} title="Policy Gate" icon={<ShieldCheck />} color="#ef4444">
            <div className="text-[10px]">{policy}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'complianceGate',
    type: 'complianceGate',
    label: 'Compliance Gate',
    category: 'Security',
    color: '#ef4444',
    icon: <ShieldCheck size={16} />,

    propertyDefinitions: [
        { name: 'policy', label: 'Policy Name', type: 'string' },
    ],
};
