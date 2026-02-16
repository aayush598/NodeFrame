import React from 'react';
import { NodeProps } from 'reactflow';
import { Container } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const PublishDockerImageNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const image = data.properties?.image || 'my-app:latest';

    return (
        <BaseNode {...props} title="Push Docker Image" icon={<Container />} color="#14b8a6">
            <div className="text-[10px]">{image}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'publishDocker',
    type: 'publishDocker',
    label: 'Publish Docker',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <Container size={16} />,
    defaultData: {
        label: 'Publish Docker',
        description: 'Publishes a docker image to a registry',
        properties: {
            image: 'my-app:latest',
        },
    },

    propertyDefinitions: [
        { name: 'image', label: 'Image Name', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            run: `docker push ${node.data.properties.image}`,
        }),
    },
};
