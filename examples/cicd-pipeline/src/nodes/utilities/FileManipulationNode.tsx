import React from 'react';
import { NodeProps } from 'reactflow';
import { FolderCog } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const FileManipulationNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const action = props.data.properties?.action || 'copy';

    return (
        <BaseNode
            {...props}
            title={data.label || "File Operation"}
            icon={<FolderCog />}
            color="#f59e0b"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {action}
                </span>
            }
        />
    );
};

export const config = {
    id: 'fileManipulation',
    type: 'fileManipulation',
    label: 'File Manipulation',
    category: 'Utilities',
    color: '#f59e0b',
    icon: <FolderCog size={16} />,

    defaultData: {
        description: 'Perform file operations',
        properties: {
            action: 'copy',
            source: '',
            destination: '',
        },
    },

    propertyDefinitions: [
        {
            name: 'action',
            label: 'Action',
            type: 'select',
            options: [
                { label: 'Copy', value: 'copy' },
                { label: 'Move', value: 'move' },
                { label: 'Delete', value: 'delete' },
            ],
        },
        { name: 'source', label: 'Source', type: 'string' },
        { name: 'destination', label: 'Destination', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'File Operation',
            run:
                n.data.properties.action === 'delete'
                    ? `rm -rf ${n.data.properties.source}`
                    : `cp -r ${n.data.properties.source} ${n.data.properties.destination}`,
        }),
        gitlab: (n: any) => ({
            script: [
                `cp -r ${n.data.properties.source} ${n.data.properties.destination}`,
            ],
        }),
        jenkins: (n: any) => [
            `sh 'cp -r ${n.data.properties.source} ${n.data.properties.destination}'`,
        ],
    },
};
