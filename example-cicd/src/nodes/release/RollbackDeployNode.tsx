import React from 'react';
import { NodeProps } from 'reactflow';
import { RotateCcw } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const RollbackDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Rollback Deploy"
            icon={<RotateCcw />}
            color="#ef4444"
        />
    );
};

export const config = {
    id: 'rollbackDeploy',
    type: 'rollbackDeploy',
    label: 'Rollback Deployment',
    category: 'Release',
    color: '#ef4444',
    icon: <RotateCcw size={16} />,

    defaultData: {
        description: 'Rollback to previous version',
        properties: {
            version: '',
        },
    },

    propertyDefinitions: [
        { name: 'version', label: 'Target Version', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Rollback Deploy',
            run: `echo "Rollback deployment"`,
        }),
        gitlab: () => ({
            script: [`echo "Rollback deployment"`],
        }),
        jenkins: () => [`sh 'echo "Rollback deployment"'`],
    },
};
