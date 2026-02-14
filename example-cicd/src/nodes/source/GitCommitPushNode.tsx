import React from 'react';
import { NodeProps } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const GitCommitPushNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const message = data.properties?.message || 'CI commit';

    return (
        <BaseNode {...props} title="Commit & Push" icon={<Upload />} color="#3b82f6">
            <div className="text-[10px]">{message}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'gitCommitPush',
    type: 'gitCommitPush',
    label: 'Commit & Push',
    category: 'Source',
    color: '#3b82f6',
    icon: <Upload size={16} />,

    propertyDefinitions: [
        { name: 'message', label: 'Commit Message', type: 'string' },
    ],

    generators: {
        github: () => ({
            run: `git add . && git commit -m "CI commit" && git push`,
        }),

        gitlab: () => ({
            script: [`git add . && git commit -m "CI commit" && git push`],
        }),

        jenkins: () => ([
            `sh 'git add . && git commit -m "CI commit" && git push'`
        ]),
    },
};
