import React from 'react';
import { NodeProps } from 'reactflow';
import { Container } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ContainerSecurityScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Container Scan" icon={<Container />} color="#ef4444" />
);

export const config = {
    id: 'containerSecurityScan',
    type: 'containerSecurityScan',
    label: 'Container Security',
    category: 'Security',
    color: '#ef4444',
    icon: <Container size={16} />,

    generators: {
        github: () => ({ run: 'trivy image my-app:latest' }),
    },
};
