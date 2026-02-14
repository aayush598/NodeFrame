import React from 'react';
import { NodeProps } from 'reactflow';
import { Shield } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const CodeQLScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="CodeQL Scan" icon={<Shield />} color="#8b5cf6" />
);

export const config = {
    id: 'codeqlScan',
    type: 'codeqlScan',
    label: 'CodeQL',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Shield size={16} />,

    generators: {
        github: () => ({
            uses: 'github/codeql-action/analyze@v3',
        }),
    },
};
