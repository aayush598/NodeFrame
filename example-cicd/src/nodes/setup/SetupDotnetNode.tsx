import React from 'react';
import { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupDotnetNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '8.0';

    return (
        <BaseNode {...props} title=".NET SDK" icon={<Layers />} color="#6366f1">
            <div className="text-[10px]">{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupDotnet',
    type: 'setupDotnet',
    label: '.NET',
    category: 'Setup',
    color: '#6366f1',
    icon: <Layers size={16} />,

    propertyDefinitions: [
        { name: 'version', label: '.NET Version', type: 'string' },
    ],
};
