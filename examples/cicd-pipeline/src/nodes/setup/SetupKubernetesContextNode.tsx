import React from 'react';
import { NodeProps } from 'reactflow';
import { Ship } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupKubernetesContextNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "K8s Context"} icon={<Ship />} color="#6366f1" />
);

export const config = {
    id: 'setupK8sContext',
    type: 'setupK8sContext',
    label: 'Kubernetes Context',
    category: 'Setup',
    color: '#6366f1',
    icon: <Ship size={16} />,
};
