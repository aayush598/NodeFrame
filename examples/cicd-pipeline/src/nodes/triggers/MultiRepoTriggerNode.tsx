import React from 'react';
import { NodeProps } from 'reactflow';
import { GitMerge } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const MultiRepoTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const repos = data.properties?.repos || '';

    return (
        <BaseNode {...props} title="Multi-Repo Trigger" icon={<GitMerge />} color="#22c55e">
            <div className="text-[10px]">{repos}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'multiRepoTrigger',
    type: 'multiRepoTrigger',
    label: 'Multi Repo',
    category: 'Triggers',
    color: '#22c55e',
    icon: <GitMerge size={16} />,

    propertyDefinitions: [
        { name: 'repos', label: 'Repositories', type: 'string' },
    ],
};
