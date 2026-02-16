import React from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ManualTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Manual Trigger"} icon={<Play />} color="#22c55e" />
);

export const config = {
    id: 'manualTrigger',
    type: 'manualTrigger',
    label: 'Manual Run',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Play size={16} />,

    generators: {
        github: () => ({ on: { workflow_dispatch: {} } }),
        gitlab: () => ({}),
        jenkins: () => ([]),
    },
};
