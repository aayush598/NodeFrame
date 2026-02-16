import React from 'react';
import { NodeProps } from 'reactflow';
import { GitMerge } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CheckoutMultipleReposNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const repos = data.properties?.repos || '';

    return (
        <BaseNode {...props} title={data.label || "Multi Checkout"} icon={<GitMerge />} color="#3b82f6">
            <div className="text-[10px]">{repos}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'checkoutMultiple',
    type: 'checkoutMultiple',
    label: 'Multi Repo Checkout',
    category: 'Source',
    color: '#3b82f6',
    icon: <GitMerge size={16} />,

    propertyDefinitions: [
        {
            name: 'repos',
            label: 'Repositories',
            type: 'textarea',
            placeholder: 'org/repo1\norg/repo2',
        },
    ],
};
