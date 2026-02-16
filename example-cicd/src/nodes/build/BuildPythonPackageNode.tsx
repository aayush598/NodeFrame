import React from 'react';
import { NodeProps } from 'reactflow';
import { Box } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildPythonPackageNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Python Package" icon={<Box />} color="#f59e0b" />
);

export const config = {
    id: 'buildPythonPackage',
    type: 'buildPythonPackage',
    label: 'Python Package',
    category: 'Build',
    color: '#f59e0b',
    icon: <Box size={16} />,

    generators: {
        github: () => ({ run: 'python -m build' }),
    },
};
