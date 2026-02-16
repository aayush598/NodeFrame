import React from 'react';
import { NodeProps } from 'reactflow';
import { Radar } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SonarQubeScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "SonarQube Scan"} icon={<Radar />} color="#8b5cf6" />
);

export const config = {
    id: 'sonarScan',
    type: 'sonarScan',
    label: 'SonarQube',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <Radar size={16} />,

    generators: {
        github: () => ({
            run: 'sonar-scanner',
        }),
    },
};
