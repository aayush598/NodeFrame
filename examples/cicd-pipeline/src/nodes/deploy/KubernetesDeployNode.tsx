import React from 'react';
import { NodeProps } from 'reactflow';
import { Boxes } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const KubernetesDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const ns = props.data.properties?.namespace || 'default';

    return (
        <BaseNode
            {...props}
            title={data.label || "Kubernetes Deploy"}
            icon={<Boxes />}
            color="#326ce5"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {ns}
                </span>
            }
        />
    );
};

export const config = {
    id: 'kubernetesDeploy',
    type: 'kubernetesDeploy',
    label: 'Kubernetes Deploy',
    category: 'Deploy',
    color: '#326ce5',
    icon: <Boxes size={16} />,

    defaultData: {
        description: 'Deploy manifests to Kubernetes',
        properties: {
            manifestPath: 'k8s/',
            namespace: 'default',
        },
    },

    propertyDefinitions: [
        { name: 'manifestPath', label: 'Manifest Path', type: 'string' },
        { name: 'namespace', label: 'Namespace', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'K8s Deploy',
            run: `kubectl apply -f ${node.data.properties.manifestPath} -n ${node.data.properties.namespace}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `kubectl apply -f ${node.data.properties.manifestPath} -n ${node.data.properties.namespace}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'kubectl apply -f ${node.data.properties.manifestPath} -n ${node.data.properties.namespace}'`,
        ],
    },
};
