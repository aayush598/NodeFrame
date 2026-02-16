import React from 'react';
import { NodeProps } from 'reactflow';
import { Server } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupNodeJSNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '18';

    return (
        <BaseNode {...props} title={data.label || "Setup Node.js"} icon={<Server />} color="#6366f1">
            <div className="text-[10px]">v{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupNodeJS',
    type: 'setupNodeJS',
    label: 'Node.js',
    category: 'Setup',
    color: '#6366f1',
    icon: <Server size={16} />,

    defaultData: { properties: { version: '18' } },

    propertyDefinitions: [
        { name: 'version', label: 'Node Version', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/setup-node@v4',
            with: { 'node-version': node.data.properties.version },
        }),
    },
};
