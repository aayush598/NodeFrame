import React from 'react';
import { NodeProps } from 'reactflow';
import { Webhook } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const WebhookNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Webhook Notify"
            icon={<Webhook />}
            color="#64748b"
        />
    );
};

export const config = {
    id: 'webhookNotify',
    type: 'webhookNotify',
    label: 'Webhook Notify',
    category: 'Notifications',
    color: '#64748b',
    icon: <Webhook size={16} />,

    defaultData: {
        description: 'Send generic webhook notification',
        properties: {
            url: '',
            payload: '{}',
        },
    },

    propertyDefinitions: [
        { name: 'url', label: 'Webhook URL', type: 'string' },
        { name: 'payload', label: 'Payload JSON', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Webhook Notify',
            run: `curl -X POST -H "Content-Type: application/json" -d '${n.data.properties.payload}' ${n.data.properties.url}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `curl -X POST -H "Content-Type: application/json" -d '${n.data.properties.payload}' ${n.data.properties.url}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'curl -X POST -H "Content-Type: application/json" -d \\'${n.data.properties.payload}\\' ${n.data.properties.url}'`,
        ],
    },
};
