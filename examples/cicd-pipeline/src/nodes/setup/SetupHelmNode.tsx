import React from 'react';
import { NodeProps } from 'reactflow';
import { Anchor } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupHelmNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Setup Helm"} icon={<Anchor />} color="#6366f1" />
);

export const config = {
    id: 'setupHelm',
    type: 'setupHelm',
    label: 'Helm',
    category: 'Setup',
    color: '#6366f1',
    icon: <Anchor size={16} />,
};
