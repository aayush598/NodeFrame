import React from 'react';
import { NodeProps } from 'reactflow';
import { Terminal } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupPythonNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '3.11';

    return (
        <BaseNode {...props} title={data.label || "Setup Python"} icon={<Terminal />} color="#6366f1">
            <div className="text-[10px]">{version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupPython',
    type: 'setupPython',
    label: 'Python',
    category: 'Setup',
    color: '#6366f1',
    icon: <Terminal size={16} />,

    propertyDefinitions: [
        { name: 'version', label: 'Python Version', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/setup-python@v5',
            with: { 'python-version': node.data.properties.version },
        }),
    },
};
