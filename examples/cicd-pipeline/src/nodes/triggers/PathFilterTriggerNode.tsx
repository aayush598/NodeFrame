import React from 'react';
import { NodeProps } from 'reactflow';
import { Filter } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PathFilterTriggerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const paths = data.properties?.paths || '';

    return (
        <BaseNode {...props} title={data.label || "Path Filter"} icon={<Filter />} color="#22c55e">
            <div className="text-[10px]">{paths}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'pathFilterTrigger',
    type: 'pathFilterTrigger',
    label: 'Path Filter',
    category: 'Triggers',
    color: '#22c55e',
    icon: <Filter size={16} />,

    propertyDefinitions: [
        { name: 'paths', label: 'Paths', type: 'string' },
    ],
};
