import React from 'react';
import { NodeProps } from 'reactflow';
import { Rocket } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ReleaseTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Release Trigger" icon={<Rocket />} color="#22c55e" />
);

export const config = {
    id: 'releaseTrigger',
    type: 'releaseTrigger',
    label: 'Release',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Rocket size={16} />,

    generators: {
        github: () => ({
            on: { release: { types: ['published'] } },
        }),

        gitlab: () => ({}),
        jenkins: () => ([]),
    },
};
