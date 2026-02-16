import React from 'react';
import { NodeProps } from 'reactflow';
import { GitPullRequest } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const PullRequestTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const target = data.properties?.targetBranch || 'main';

    return (
        <BaseNode {...props} title={data.label || "Pull Request"} icon={<GitPullRequest />} color="#16a34a">
            <div className="text-[10px]">Target: {target}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'prTrigger',
    type: 'prTrigger',
    label: 'Pull Request',
    category: 'Triggers',
    color: '#16a34a',
    icon: <GitPullRequest size={16} />,

    defaultData: {
        properties: { targetBranch: 'main' },
    },

    propertyDefinitions: [
        { name: 'targetBranch', label: 'Target Branch', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            on: {
                pull_request: {
                    branches: [node.data.properties.targetBranch],
                },
            },
        }),

        gitlab: () => ({}),
        jenkins: () => ([]),
    },
};
