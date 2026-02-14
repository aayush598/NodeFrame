import React from 'react';
import { NodeProps } from 'reactflow';
import { Filter } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const SparseCheckoutNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const paths = data.properties?.paths || '';

    return (
        <BaseNode {...props} title="Sparse Checkout" icon={<Filter />} color="#3b82f6">
            <div className="text-[10px]">{paths}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'sparseCheckout',
    type: 'sparseCheckout',
    label: 'Sparse Checkout',
    category: 'Source',
    color: '#3b82f6',
    icon: <Filter size={16} />,

    propertyDefinitions: [
        { name: 'paths', label: 'Paths', type: 'textarea' },
    ],
};
