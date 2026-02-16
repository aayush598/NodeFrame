import React from 'react';
import { NodeProps } from 'reactflow';
import { Users } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TeamsNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const channel = props.data.properties?.channel || 'team-channel';

    return (
        <BaseNode
            {...props}
            title={data.label || "Teams Notify"}
            icon={<Users />}
            color="#6264a7"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {channel}
                </span>
            }
        />
    );
};

export const config = {
    id: 'teamsNotify',
    type: 'teamsNotify',
    label: 'Teams Notify',
    category: 'Notifications',
    color: '#6264a7',
    icon: <Users size={16} />,

    defaultData: {
        description: 'Send Microsoft Teams notification',
        properties: {
            webhookUrl: '',
            channel: '',
            message: 'Pipeline completed',
        },
    },

    propertyDefinitions: [
        { name: 'webhookUrl', label: 'Webhook URL', type: 'string' },
        { name: 'channel', label: 'Channel', type: 'string' },
        { name: 'message', label: 'Message', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Teams Notify',
            run: `curl -H "Content-Type: application/json" -d '{"text":"${n.data.properties.message}"}' ${n.data.properties.webhookUrl}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `curl -H "Content-Type: application/json" -d '{"text":"${n.data.properties.message}"}' ${n.data.properties.webhookUrl}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'curl -H "Content-Type: application/json" -d "{\\"text\\":\\"${n.data.properties.message}\\"}" ${n.data.properties.webhookUrl}'`,
        ],
    },
};
