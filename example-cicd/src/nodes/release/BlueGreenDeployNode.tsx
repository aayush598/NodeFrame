import React from 'react';
import { NodeProps } from 'reactflow';
import { Split } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BlueGreenDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Blue/Green Deploy"
            icon={<Split />}
            color="#06b6d4"
        />
    );
};

export const config = {
    id: 'blueGreenDeploy',
    type: 'blueGreenDeploy',
    label: 'Blue Green Deploy',
    category: 'Release',
    color: '#06b6d4',
    icon: <Split size={16} />,

    defaultData: {
        description: 'Blue/Green deployment strategy',
        properties: {
            service: '',
        },
    },

    propertyDefinitions: [
        { name: 'service', label: 'Service', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Blue Green Deploy',
            run: `echo "Blue/Green deployment"`,
        }),
        gitlab: () => ({
            script: [`echo "Blue/Green deployment"`],
        }),
        jenkins: () => [`sh 'echo "Blue/Green deployment"'`],
    },
};
