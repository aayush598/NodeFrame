import React from 'react';
import { NodeProps } from 'reactflow';
import { Gem } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupRubyNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '3.3';

    return (
        <BaseNode {...props} title={data.label || "Setup Ruby"} icon={<Gem />} color="#6366f1">
            <div className="text-[10px]">{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupRuby',
    type: 'setupRuby',
    label: 'Ruby',
    category: 'Setup',
    color: '#6366f1',
    icon: <Gem size={16} />,
};
