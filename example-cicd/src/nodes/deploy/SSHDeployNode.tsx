import React from 'react';
import { NodeProps } from 'reactflow';
import { Terminal } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const SSHDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="SSH Deploy"
            icon={<Terminal />}
            color="#64748b"
        />
    );
};

export const config = {
    id: 'sshDeploy',
    type: 'sshDeploy',
    label: 'SSH Deploy',
    category: 'Deploy',
    color: '#64748b',
    icon: <Terminal size={16} />,

    defaultData: {
        description: 'Deploy via SSH',
        properties: {
            host: '',
            user: 'ubuntu',
            command: 'deploy.sh',
        },
    },

    propertyDefinitions: [
        { name: 'host', label: 'Host', type: 'string' },
        { name: 'user', label: 'User', type: 'string' },
        { name: 'command', label: 'Command', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'SSH Deploy',
            run: `ssh ${node.data.properties.user}@${node.data.properties.host} "${node.data.properties.command}"`,
        }),
        gitlab: (node: any) => ({
            script: [
                `ssh ${node.data.properties.user}@${node.data.properties.host} "${node.data.properties.command}"`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'ssh ${node.data.properties.user}@${node.data.properties.host} "${node.data.properties.command}"'`,
        ],
    },
};
