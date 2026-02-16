import React from 'react';
import { NodeProps } from 'reactflow';
import { Tag } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const TagTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const pattern = data.properties?.pattern || 'v*';

    return (
        <BaseNode {...props} title={data.label || "Tag Trigger"} icon={<Tag />} color="#22c55e">
            <div className="text-[10px]">Pattern: {pattern}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'tagTrigger',
    type: 'tagTrigger',
    label: 'Tag Trigger',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Tag size={16} />,

    defaultData: {
        properties: { pattern: 'v*' },
    },

    propertyDefinitions: [
        { name: 'pattern', label: 'Tag Pattern', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            on: { push: { tags: [node.data.properties.pattern] } },
        }),

        gitlab: () => ({}),
        jenkins: () => ([]),
    },
};
