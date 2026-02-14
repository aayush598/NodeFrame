import React from 'react';
import { NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

export const GitPushTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const branches = data.properties?.branches || ['main'];
    const eventType = data.properties?.eventType || 'push';

    const headerRight = (
        <span className="text-[9px] font-bold text-white bg-green-600 px-1.5 py-0.5 rounded uppercase">
            {eventType}
        </span>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Git Push Trigger'}
            icon={data.icon || <GitBranch />}
            color={data.color || '#10b981'}
            headerRight={headerRight}
            isTarget={false}
        >
            {/* Branch Display */}
            <div className="flex flex-wrap gap-1">
                {branches.slice(0, 2).map((branch: string, i: number) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                        {branch}
                    </span>
                ))}
                {branches.length > 2 && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        +{branches.length - 2}
                    </span>
                )}
            </div>
        </BaseNode>
    );
};
