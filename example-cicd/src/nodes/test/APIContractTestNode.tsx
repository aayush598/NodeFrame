import React from 'react';
import { NodeProps } from 'reactflow';
import { FileCode } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const APIContractTestNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="API Contract Tests" icon={<FileCode />} color="#10b981" />
);

export const config = {
    id: 'apiContractTests',
    type: 'apiContractTests',
    label: 'API Contract',
    category: 'Test',
    color: '#10b981',
    icon: <FileCode size={16} />,

    generators: {
        github: () => ({ run: 'npm run test:contract' }),
    },
};
