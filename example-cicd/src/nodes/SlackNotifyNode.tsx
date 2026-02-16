import React from 'react';
import { NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const SlackNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const channel = data.properties?.channel || '#general';
    const onlyOnFailure = data.properties?.onlyOnFailure === true;

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                {channel}
            </span>
            {onlyOnFailure && (
                <span className="text-[9px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">
                    ON FAIL
                </span>
            )}
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Slack Notify'}
            icon={data.icon || <MessageSquare />}
            color={data.color || '#6366f1'}
            headerRight={headerRight}
        />
    );
};

export const config = {
    id: 'slackNotify',
    type: 'slackNotify',
    label: 'Slack Notify',
    category: 'Notifications',
    color: '#6366f1',
    icon: <MessageSquare size={16} />,
    defaultData: {
        description: 'Sends notifications to a Slack channel about pipeline status',
        properties: {
            webhookUrl: '',
            channel: '#general',
            message: 'Pipeline completed!',
            onlyOnFailure: false,
        },
        onExecute: () => ({ notified: true }),
    },
    propertyDefinitions: [
        {
            name: 'channel',
            label: 'Channel',
            type: 'string',
            defaultValue: '#general',
        },
        {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            defaultValue: 'Pipeline completed!',
        },
        {
            name: 'onlyOnFailure',
            label: 'Only on Failure',
            type: 'boolean',
            defaultValue: false,
        },
    ],
    generators: {
        github: (node: any) => {
            const channel = node.data.properties?.channel || '#general';
            const onlyOnFailure = node.data.properties?.onlyOnFailure === true;

            const slackStep: any = {
                name: node.data.label || 'Notify Slack',
                uses: 'slackapi/slack-github-action@v1',
                with: {
                    'channel-id': channel,
                    'slack-message': 'Pipeline completed!',
                },
                env: {
                    SLACK_BOT_TOKEN: '${{ secrets.SLACK_BOT_TOKEN }}',
                }
            };

            if (onlyOnFailure) {
                slackStep.if = 'failure()';
            }

            return slackStep;
        },
        gitlab: (_node: any) => {
            return {
                script: ['echo "Sending Slack notification"']
            };
        },
        jenkins: (node: any) => {
            const channel = node.data.properties?.channel || '#general';
            return [`echo 'Sending Slack notification to ${channel}'`];
        }
    }
};
