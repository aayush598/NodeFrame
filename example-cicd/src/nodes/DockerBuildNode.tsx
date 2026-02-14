import React from 'react';
import { NodeProps } from 'reactflow';
import { Container } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

export const DockerBuildNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const imageName = data.properties?.imageName || 'my-app';
    const tags = data.properties?.tags || ['latest'];

    const headerRight = (
        <div className="text-[10px] text-gray-500 font-mono truncate max-w-[140px] w-full">
            {imageName}
        </div>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Docker Build'}
            icon={data.icon || <Container />}
            color={data.color || '#0ea5e9'}
            headerRight={headerRight}
        >
            {/* Tags Display */}
            <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag: string, i: number) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded font-mono">
                        :{tag}
                    </span>
                ))}
                {tags.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                        +{tags.length - 3}
                    </span>
                )}
            </div>
        </BaseNode>
    );
};

export const config = {
    id: 'dockerBuild',
    type: 'dockerBuild',
    label: 'Docker Build',
    category: 'Build',
    color: '#0ea5e9',
    icon: <Container size={16} />,
    defaultData: {
        description: 'Builds a Docker image from a Dockerfile and optionally pushes it to a registry',
        properties: {
            imageName: 'my-app',
            tags: ['latest'],
            dockerfile: 'Dockerfile',
            push: true,
        },
        onExecute: () => ({ built: true }),
    },
    propertyDefinitions: [
        {
            name: 'imageName',
            label: 'Image Name',
            type: 'string',
            defaultValue: 'my-app',
        },
        {
            name: 'tags',
            label: 'Tags (comma-separated)',
            type: 'string',
            defaultValue: 'latest',
        },
        {
            name: 'dockerfile',
            label: 'Dockerfile Path',
            type: 'string',
            defaultValue: 'Dockerfile',
        },
        {
            name: 'push',
            label: 'Push to Registry',
            type: 'boolean',
            defaultValue: true,
        },
    ]
};
