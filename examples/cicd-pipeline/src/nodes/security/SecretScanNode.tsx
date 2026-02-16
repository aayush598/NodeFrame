import React from 'react';
import { NodeProps } from 'reactflow';
import { Key } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SecretScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Secret Scan"} icon={<Key />} color="#ef4444" />
);

export const config = {
    id: 'secretScan',
    type: 'secretScan',
    label: 'Secrets Detection',
    category: 'Security',
    color: '#ef4444',
    icon: <Key size={16} />,

    generators: {
        github: () => ({ run: 'gitleaks detect --source .' }),
        gitlab: () => ({ script: ['gitleaks detect --source .'] }),
        jenkins: () => ([`sh 'gitleaks detect --source .'`]),
    },
};
