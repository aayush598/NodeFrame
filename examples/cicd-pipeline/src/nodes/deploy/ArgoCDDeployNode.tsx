import React from 'react';
import { NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ArgoCDDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "ArgoCD Sync"}
            icon={<GitBranch />}
            color="#ef7b4d"
        />
    );
};

export const config = {
    id: 'argocdDeploy',
    type: 'argocdDeploy',
    label: 'ArgoCD Deploy',
    category: 'Deploy',
    color: '#ef7b4d',
    icon: <GitBranch size={16} />,

    defaultData: {
        description: 'Sync ArgoCD application',
        properties: {
            appName: '',
        },
    },

    propertyDefinitions: [
        { name: 'appName', label: 'Application Name', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'ArgoCD Sync',
            run: `argocd app sync ${node.data.properties.appName}`,
        }),
        gitlab: (node: any) => ({
            script: [`argocd app sync ${node.data.properties.appName}`],
        }),
        jenkins: (node: any) => [
            `sh 'argocd app sync ${node.data.properties.appName}'`,
        ],
    },
};
