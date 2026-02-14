import React from 'react';
import { NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

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
