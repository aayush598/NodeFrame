import React from 'react';
import { NodeProps } from 'reactflow';
import { AlertTriangle } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PagerDutyNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "PagerDuty Alert"}
            icon={<AlertTriangle />}
            color="#06b6d4"
        />
    );
};

export const config = {
    id: 'pagerDutyNotify',
    type: 'pagerDutyNotify',
    label: 'PagerDuty Notify',
    category: 'Notifications',
    color: '#06b6d4',
    icon: <AlertTriangle size={16} />,

    defaultData: {
        description: 'Trigger PagerDuty incident',
        properties: {
            routingKey: '',
            message: 'Deployment failure',
        },
    },

    propertyDefinitions: [
        { name: 'routingKey', label: 'Routing Key', type: 'string' },
        { name: 'message', label: 'Message', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'PagerDuty Alert',
            run: `echo "Trigger PagerDuty alert"`,
        }),
        gitlab: () => ({
            script: [`echo "Trigger PagerDuty alert"`],
        }),
        jenkins: () => [`sh 'echo "Trigger PagerDuty alert"'`],
    },
};
