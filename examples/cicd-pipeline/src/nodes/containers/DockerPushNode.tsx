import React from 'react';
import { NodeProps } from 'reactflow';
import { UploadCloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DockerPushNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const tag = props.data.properties?.tag || 'latest';

    return (
        <BaseNode
            {...props}
            title={data.label || "Docker Push"}
            icon={<UploadCloud />}
            color="#22c55e"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {tag}
                </span>
            }
        />
    );
};

export const config = {
    id: 'dockerPush',
    type: 'dockerPush',
    label: 'Docker Push',
    category: 'Containers',
    color: '#22c55e',
    icon: <UploadCloud size={16} />,

    defaultData: {
        description: 'Push Docker image to registry',
        properties: {
            image: '',
            tag: 'latest',
        },
    },

    propertyDefinitions: [
        { name: 'image', label: 'Image', type: 'string' },
        { name: 'tag', label: 'Tag', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Docker Push',
            run: `docker push ${node.data.properties.image}:${node.data.properties.tag}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `docker push ${node.data.properties.image}:${node.data.properties.tag}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'docker push ${node.data.properties.image}:${node.data.properties.tag}'`,
        ],
    },
};
