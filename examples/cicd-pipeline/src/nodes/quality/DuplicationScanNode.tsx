import React from 'react';
import { NodeProps } from 'reactflow';
import { Copy } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DuplicationScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Duplication Scan" icon={<Copy />} color="#8b5cf6" />
);

export const config = {
    id: 'duplicationScan',
    type: 'duplicationScan',
    label: 'Duplication',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Copy size={16} />,

    generators: {
        github: () => ({ run: 'npx jscpd src' }),
    },
};
