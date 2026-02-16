import React from 'react';
import { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const MultiArchBuildNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const platforms = props.data.properties?.platforms || 'linux/amd64,linux/arm64';

    return (
        <BaseNode
            {...props}
            title={data.label || "Multi-Arch Build"}
            icon={<Layers />}
            color="#8b5cf6"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {platforms}
                </span>
            }
        />
    );
};

export const config = {
    id: 'multiArchBuild',
    type: 'multiArchBuild',
    label: 'Multi-Arch Build',
    category: 'Containers',
    color: '#8b5cf6',
    icon: <Layers size={16} />,

    defaultData: {
        description: 'Build multi-architecture Docker images',
        properties: {
            image: '',
            tag: 'latest',
            platforms: 'linux/amd64,linux/arm64',
        },
    },

    propertyDefinitions: [
        { name: 'image', label: 'Image', type: 'string' },
        { name: 'tag', label: 'Tag', type: 'string' },
        { name: 'platforms', label: 'Platforms', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Multi Arch Build',
            run: `docker buildx build --platform ${node.data.properties.platforms} -t ${node.data.properties.image}:${node.data.properties.tag} .`,
        }),
        gitlab: (node: any) => ({
            script: [
                `docker buildx build --platform ${node.data.properties.platforms} -t ${node.data.properties.image}:${node.data.properties.tag} .`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'docker buildx build --platform ${node.data.properties.platforms} -t ${node.data.properties.image}:${node.data.properties.tag} .'`,
        ],
    },
};
