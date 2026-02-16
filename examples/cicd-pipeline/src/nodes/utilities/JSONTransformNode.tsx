import React from 'react';
import { NodeProps } from 'reactflow';
import { Braces } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const JSONTransformNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="JSON Transform"
            icon={<Braces />}
            color="#10b981"
        />
    );
};

export const config = {
    id: 'jsonTransform',
    type: 'jsonTransform',
    label: 'JSON Transform',
    category: 'Utilities',
    color: '#10b981',
    icon: <Braces size={16} />,

    defaultData: {
        description: 'Transform JSON data',
        properties: {
            jqExpression: '.',
        },
    },

    propertyDefinitions: [
        { name: 'jqExpression', label: 'jq Expression', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Transform JSON',
            run: `cat data.json | jq '${n.data.properties.jqExpression}'`,
        }),
        gitlab: (n: any) => ({
            script: [`cat data.json | jq '${n.data.properties.jqExpression}'`],
        }),
        jenkins: (n: any) => [
            `sh "cat data.json | jq '${n.data.properties.jqExpression}'"`,
        ],
    },
};
