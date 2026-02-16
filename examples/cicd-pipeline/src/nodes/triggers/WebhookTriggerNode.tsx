import React from 'react';
import { NodeProps } from 'reactflow';
import { Webhook } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const WebhookTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Webhook Trigger"} icon={<Webhook />} color="#22c55e" />
);

export const config = {
    id: 'webhookTrigger',
    type: 'webhookTrigger',
    label: 'Webhook',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Webhook size={16} />,
};
