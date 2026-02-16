import React from 'react';
import { NodeProps } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const FTPDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "FTP Deploy"}
            icon={<Upload />}
            color="#f97316"
        />
    );
};

export const config = {
    id: 'ftpDeploy',
    type: 'ftpDeploy',
    label: 'FTP Deploy',
    category: 'Deploy',
    color: '#f97316',
    icon: <Upload size={16} />,

    defaultData: {
        description: 'Upload files via FTP',
        properties: {
            server: '',
            path: '/public_html',
        },
    },

    propertyDefinitions: [
        { name: 'server', label: 'Server', type: 'string' },
        { name: 'path', label: 'Remote Path', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'FTP Deploy',
            run: `echo "Deploy via FTP"`,
        }),
        gitlab: () => ({
            script: [`echo "Deploy via FTP"`],
        }),
        jenkins: () => [`sh 'echo "Deploy via FTP"'`],
    },
};
