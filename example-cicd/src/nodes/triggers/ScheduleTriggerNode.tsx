import React from 'react';
import { NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ScheduleTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const cron = data.properties?.cron || '0 0 * * *';

    return (
        <BaseNode {...props} title="Schedule" icon={<Clock />} color="#22c55e">
            <div className="text-[10px] font-mono">{cron}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'scheduleTrigger',
    type: 'scheduleTrigger',
    label: 'Schedule',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Clock size={16} />,

    defaultData: {
        properties: { cron: '0 0 * * *' },
    },

    propertyDefinitions: [
        { name: 'cron', label: 'Cron', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            on: { schedule: [{ cron: node.data.properties.cron }] },
        }),

        gitlab: () => ({}),
        jenkins: () => ([]),
    },
};
