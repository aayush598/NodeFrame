import React from 'react';
import { NodeProps } from 'reactflow';
import { MessageCircle } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DiscordNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Discord Notify"
            icon={<MessageCircle />}
            color="#5865f2"
        />
    );
};

export const config = {
    id: 'discordNotify',
    type: 'discordNotify',
    label: 'Discord Notify',
    category: 'Notifications',
    color: '#5865f2',
    icon: <MessageCircle size={16} />,

    defaultData: {
        description: 'Send Discord webhook notification',
        properties: {
            webhookUrl: '',
            message: 'Pipeline update',
        },
    },

    propertyDefinitions: [
        { name: 'webhookUrl', label: 'Webhook URL', type: 'string' },
        { name: 'message', label: 'Message', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Discord Notify',
            run: `curl -H "Content-Type: application/json" -d '{"content":"${n.data.properties.message}"}' ${n.data.properties.webhookUrl}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `curl -H "Content-Type: application/json" -d '{"content":"${n.data.properties.message}"}' ${n.data.properties.webhookUrl}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'curl -H "Content-Type: application/json" -d "{\\"content\\":\\"${n.data.properties.message}\\"}" ${n.data.properties.webhookUrl}'`,
        ],
    },
};
