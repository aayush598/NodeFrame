import React from 'react';
import { NodeProps } from 'reactflow';
import { ArrowUpCircle } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PromoteBuildNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const from = props.data.properties?.fromEnv || 'staging';
    const to = props.data.properties?.toEnv || 'production';

    return (
        <BaseNode
            {...props}
            title="Promote Build"
            icon={<ArrowUpCircle />}
            color="#6366f1"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {from} → {to}
                </span>
            }
        />
    );
};

export const config = {
    id: 'promoteBuild',
    type: 'promoteBuild',
    label: 'Promote Build',
    category: 'Release',
    color: '#6366f1',
    icon: <ArrowUpCircle size={16} />,

    defaultData: {
        description: 'Promote build across environments',
        properties: {
            fromEnv: 'staging',
            toEnv: 'production',
        },
    },

    propertyDefinitions: [
        { name: 'fromEnv', label: 'From', type: 'string' },
        { name: 'toEnv', label: 'To', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Promote Build',
            run: `echo "Promoting build"`,
        }),
        gitlab: () => ({
            script: [`echo "Promoting build"`],
        }),
        jenkins: () => [`sh 'echo "Promoting build"'`],
    },
};
