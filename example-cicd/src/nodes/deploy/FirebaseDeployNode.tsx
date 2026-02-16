import React from 'react';
import { NodeProps } from 'reactflow';
import { Flame } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const FirebaseDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return <BaseNode {...props} title="Firebase Deploy" icon={<Flame />} color="#f59e0b" />;
};

export const config = {
    id: 'firebaseDeploy',
    type: 'firebaseDeploy',
    label: 'Firebase Deploy',
    category: 'Deploy',
    color: '#f59e0b',
    icon: <Flame size={16} />,

    defaultData: {
        description: 'Deploy to Firebase Hosting',
        properties: {
            projectId: '',
        },
    },

    propertyDefinitions: [
        { name: 'projectId', label: 'Project ID', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Firebase Deploy',
            run: `firebase deploy --project ${n.data.properties.projectId}`,
        }),
        gitlab: (n: any) => ({
            script: [`firebase deploy --project ${n.data.properties.projectId}`],
        }),
        jenkins: (n: any) => [
            `sh 'firebase deploy --project ${n.data.properties.projectId}'`,
        ],
    },
};
