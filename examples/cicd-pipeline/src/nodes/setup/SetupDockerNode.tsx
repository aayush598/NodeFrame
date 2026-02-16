import React from 'react';
import { NodeProps } from 'reactflow';
import { Container } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupDockerNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Setup Docker"} icon={<Container />} color="#6366f1" />
);

export const config = {
    id: 'setupDocker',
    type: 'setupDocker',
    label: 'Docker Engine',
    category: 'Setup',
    color: '#6366f1',
    icon: <Container size={16} />,
};
