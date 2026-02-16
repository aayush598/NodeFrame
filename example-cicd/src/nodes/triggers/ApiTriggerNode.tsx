import React from 'react';
import { NodeProps } from 'reactflow';
import { Cloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ApiTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="API Trigger" icon={<Cloud />} color="#22c55e" />
);

export const config = {
    id: 'apiTrigger',
    type: 'apiTrigger',
    label: 'API Trigger',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Cloud size={16} />,
};
