import React from 'react';
import { NodeProps } from 'reactflow';
import { Bell } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const OpsgenieNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Opsgenie Alert"
            icon={<Bell />}
            color="#f97316"
        />
    );
};

export const config = {
    id: 'opsgenieNotify',
    type: 'opsgenieNotify',
    label: 'Opsgenie Notify',
    category: 'Notifications',
    color: '#f97316',
    icon: <Bell size={16} />,

    defaultData: {
        description: 'Trigger Opsgenie alert',
        properties: {
            apiKey: '',
            message: '',
        },
    },

    propertyDefinitions: [
        { name: 'apiKey', label: 'API Key', type: 'string' },
        { name: 'message', label: 'Message', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Opsgenie Alert',
            run: `echo "Trigger Opsgenie alert"`,
        }),
        gitlab: () => ({
            script: [`echo "Trigger Opsgenie alert"`],
        }),
        jenkins: () => [`sh 'echo "Trigger Opsgenie alert"'`],
    },
};
