import React from 'react';
import { NodeProps } from 'reactflow';
import { Tag } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CreateTagNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const tag = data.properties?.tag || 'v0.1.1';

    return (
        <BaseNode {...props} title={data.label || "Create Tag"} icon={<Tag />} color="#3b82f6">
            <div className="text-[10px]">{tag}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'createTag',
    type: 'createTag',
    label: 'Create Tag',
    category: 'Source',
    color: '#3b82f6',
    icon: <Tag size={16} />,

    propertyDefinitions: [
        { name: 'tag', label: 'Tag Name', type: 'string' },
    ],

    generators: {
        github: () => ({ run: 'git tag v0.1.1 && git push --tags' }),
        gitlab: () => ({ script: ['git tag v0.1.1 && git push --tags'] }),
        jenkins: () => ([`sh 'git tag v0.1.1 && git push --tags'`]),
    },
};
