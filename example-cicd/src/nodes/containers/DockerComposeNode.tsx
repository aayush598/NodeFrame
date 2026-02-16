import React from 'react';
import { NodeProps } from 'reactflow';
import { Boxes } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DockerComposeNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const file = props.data.properties?.composeFile || 'docker-compose.yml';

    return (
        <BaseNode
            {...props}
            title="Docker Compose"
            icon={<Boxes />}
            color="#f59e0b"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    {file}
                </span>
            }
        />
    );
};

export const config = {
    id: 'dockerCompose',
    type: 'dockerCompose',
    label: 'Docker Compose',
    category: 'Containers',
    color: '#f59e0b',
    icon: <Boxes size={16} />,

    defaultData: {
        description: 'Run Docker Compose services',
        properties: {
            composeFile: 'docker-compose.yml',
            command: 'up -d',
        },
    },

    propertyDefinitions: [
        { name: 'composeFile', label: 'Compose File', type: 'string' },
        { name: 'command', label: 'Command', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Docker Compose',
            run: `docker compose -f ${node.data.properties.composeFile} ${node.data.properties.command}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `docker compose -f ${node.data.properties.composeFile} ${node.data.properties.command}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'docker compose -f ${node.data.properties.composeFile} ${node.data.properties.command}'`,
        ],
    },
};
