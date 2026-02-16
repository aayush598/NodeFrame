import React from 'react';
import { NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const HelmDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const release = props.data.properties?.releaseName || 'app';

    return (
        <BaseNode
            {...props}
            title="Helm Deploy"
            icon={<Package />}
            color="#0f766e"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {release}
                </span>
            }
        />
    );
};

export const config = {
    id: 'helmDeploy',
    type: 'helmDeploy',
    label: 'Helm Deploy',
    category: 'Deploy',
    color: '#0f766e',
    icon: <Package size={16} />,

    defaultData: {
        description: 'Deploy Helm chart',
        properties: {
            chartPath: './chart',
            releaseName: 'app',
            namespace: 'default',
        },
    },

    propertyDefinitions: [
        { name: 'chartPath', label: 'Chart Path', type: 'string' },
        { name: 'releaseName', label: 'Release Name', type: 'string' },
        { name: 'namespace', label: 'Namespace', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Helm Deploy',
            run: `helm upgrade --install ${node.data.properties.releaseName} ${node.data.properties.chartPath} -n ${node.data.properties.namespace}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `helm upgrade --install ${node.data.properties.releaseName} ${node.data.properties.chartPath} -n ${node.data.properties.namespace}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'helm upgrade --install ${node.data.properties.releaseName} ${node.data.properties.chartPath} -n ${node.data.properties.namespace}'`,
        ],
    },
};
