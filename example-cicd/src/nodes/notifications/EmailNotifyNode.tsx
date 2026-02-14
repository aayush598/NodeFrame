import React from 'react';
import { NodeProps } from 'reactflow';
import { Mail } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const EmailNotifyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const to = props.data.properties?.to || 'team@example.com';

    return (
        <BaseNode
            {...props}
            title="Email Notify"
            icon={<Mail />}
            color="#ea4335"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {to}
                </span>
            }
        />
    );
};

export const config = {
    id: 'emailNotify',
    type: 'emailNotify',
    label: 'Email Notify',
    category: 'Notifications',
    color: '#ea4335',
    icon: <Mail size={16} />,

    defaultData: {
        description: 'Send email notification',
        properties: {
            to: '',
            subject: 'Pipeline Status',
            body: 'Pipeline completed successfully',
        },
    },

    propertyDefinitions: [
        { name: 'to', label: 'Recipient', type: 'string' },
        { name: 'subject', label: 'Subject', type: 'string' },
        { name: 'body', label: 'Body', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Email Notify',
            run: `echo "Send email notification"`,
        }),
        gitlab: () => ({
            script: [`echo "Send email notification"`],
        }),
        jenkins: () => [`sh 'echo "Send email notification"'`],
    },
};
