import React from 'react';
import { NodeProps } from 'reactflow';
import { TerminalSquare } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PowerShellNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "PowerShell"}
            icon={<TerminalSquare />}
            color="#2563eb"
        />
    );
};

export const config = {
    id: 'powerShell',
    type: 'powerShell',
    label: 'PowerShell Command',
    category: 'Utilities',
    color: '#2563eb',
    icon: <TerminalSquare size={16} />,

    defaultData: {
        description: 'Execute PowerShell command',
        properties: {
            command: 'Write-Host "Hello"',
        },
    },

    propertyDefinitions: [
        { name: 'command', label: 'Command', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Run PowerShell',
            shell: 'pwsh',
            run: n.data.properties.command,
        }),
        gitlab: (n: any) => ({
            script: [n.data.properties.command],
        }),
        jenkins: (n: any) => [
            `powershell '${n.data.properties.command}'`,
        ],
    },
};
