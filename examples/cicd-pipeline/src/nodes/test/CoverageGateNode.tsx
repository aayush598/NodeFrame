import React from 'react';
import { NodeProps } from 'reactflow';
import { ShieldCheck } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CoverageGateNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const threshold = data.properties?.threshold || 80;

    return (
        <BaseNode {...props} title="Coverage Gate" icon={<ShieldCheck />} color="#10b981">
            <div className="text-[10px]">{threshold}%</div>
        </BaseNode>
    );
};

export const config = {
    id: 'coverageGate',
    type: 'coverageGate',
    label: 'Coverage Gate',
    category: 'Test',
    color: '#10b981',
    icon: <ShieldCheck size={16} />,

    propertyDefinitions: [
        { name: 'threshold', label: 'Coverage %', type: 'number' },
    ],
};
