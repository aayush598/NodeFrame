import React from 'react';
import { NodeProps } from 'reactflow';
import { Boxes } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupBuildxNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Docker Buildx" icon={<Boxes />} color="#6366f1" />
);

export const config = {
    id: 'setupBuildx',
    type: 'setupBuildx',
    label: 'Docker Buildx',
    category: 'Setup',
    color: '#6366f1',
    icon: <Boxes size={16} />,
};
