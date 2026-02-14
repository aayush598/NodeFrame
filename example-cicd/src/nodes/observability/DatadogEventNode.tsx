import React from 'react';
import { NodeProps } from 'reactflow';
import { Activity } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const DatadogEventNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Datadog Event"
            icon={<Activity />}
            color="#632ca6"
        />
    );
};

export const config = {
    id: 'datadogEvent',
    type: 'datadogEvent',
    label: 'Datadog Event',
    category: 'Observability',
    color: '#632ca6',
    icon: <Activity size={16} />,

    defaultData: {
        description: 'Send deployment event to Datadog',
        properties: {
            apiKey: '',
            title: 'Deployment',
            text: 'New deployment completed',
        },
    },

    propertyDefinitions: [
        { name: 'apiKey', label: 'API Key', type: 'string' },
        { name: 'title', label: 'Title', type: 'string' },
        { name: 'text', label: 'Text', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Datadog Event',
            run: `echo "Send Datadog deployment event"`,
        }),
        gitlab: () => ({
            script: [`echo "Send Datadog deployment event"`],
        }),
        jenkins: () => [`sh 'echo "Send Datadog deployment event"'`],
    },
};
