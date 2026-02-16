import React from 'react';
import { NodeProps } from 'reactflow';
import { Box } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const GoModulesInstallNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Go Modules"} icon={<Box />} color="#0ea5e9" />
);

export const config = {
    id: 'goModulesInstall',
    type: 'goModulesInstall',
    label: 'Go Modules',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Box size={16} />,

    generators: {
        github: () => ({ run: 'go mod download' }),
        gitlab: () => ({ script: ['go mod download'] }),
        jenkins: () => ([`sh 'go mod download'`]),
    },
};
