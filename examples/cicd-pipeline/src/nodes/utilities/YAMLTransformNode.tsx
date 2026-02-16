import React from 'react';
import { NodeProps } from 'reactflow';
import { FileCode } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const YAMLTransformNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "YAML Transform"}
            icon={<FileCode />}
            color="#6366f1"
        />
    );
};

export const config = {
    id: 'yamlTransform',
    type: 'yamlTransform',
    label: 'YAML Transform',
    category: 'Utilities',
    color: '#6366f1',
    icon: <FileCode size={16} />,

    defaultData: {
        description: 'Transform YAML files',
        properties: {
            file: 'config.yml',
        },
    },

    propertyDefinitions: [
        { name: 'file', label: 'YAML File', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Transform YAML',
            run: `echo "Processing ${n.data.properties.file}"`,
        }),
        gitlab: (n: any) => ({
            script: [`echo "Processing ${n.data.properties.file}"`],
        }),
        jenkins: (n: any) => [
            `sh 'echo "Processing ${n.data.properties.file}"'`,
        ],
    },
};
