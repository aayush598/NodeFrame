import React from 'react';
import { NodeProps } from 'reactflow';
import { Terminal } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const InstallPythonDepsNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const tool = data.properties?.tool || 'pip';

    return (
        <BaseNode {...props} title="Python Dependencies" icon={<Terminal />} color="#0ea5e9">
            <div className="text-[10px]">{tool}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'installPythonDeps',
    type: 'installPythonDeps',
    label: 'Python Dependencies',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Terminal size={16} />,

    propertyDefinitions: [
        {
            name: 'tool',
            label: 'Tool',
            type: 'select',
            options: [
                { label: 'pip', value: 'pip' },
                { label: 'poetry', value: 'poetry' },
            ],
        },
    ],

    generators: {
        github: (node: any) => ({
            run:
                node.data.properties.tool === 'poetry'
                    ? 'poetry install'
                    : 'pip install -r requirements.txt',
        }),
    },
};
