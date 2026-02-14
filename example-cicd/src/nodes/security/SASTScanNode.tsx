import React from 'react';
import { NodeProps } from 'reactflow';
import { ScanSearch } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const SASTScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="SAST Scan" icon={<ScanSearch />} color="#ef4444" />
);

export const config = {
    id: 'sastScan',
    type: 'sastScan',
    label: 'SAST',
    category: 'Security',
    color: '#ef4444',
    icon: <ScanSearch size={16} />,

    generators: {
        github: () => ({ run: 'semgrep scan' }),
    },
};
