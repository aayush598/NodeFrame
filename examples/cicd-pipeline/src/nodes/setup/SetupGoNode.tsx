import React from 'react';
import { NodeProps } from 'reactflow';
import { Box } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupGoNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '1.22';

    return (
        <BaseNode {...props} title={data.label || "Setup Go"} icon={<Box />} color="#6366f1">
            <div className="text-[10px]">{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupGo',
    type: 'setupGo',
    label: 'Go',
    category: 'Setup',
    color: '#6366f1',
    icon: <Box size={16} />,

    propertyDefinitions: [
        { name: 'version', label: 'Go Version', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/setup-go@v5',
            with: { 'go-version': node.data.properties.version },
        }),
    },
};
