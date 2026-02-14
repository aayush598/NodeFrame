import React from 'react';
import { NodeProps } from 'reactflow';
import { BarChart } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const ComplexityAnalysisNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Complexity Analysis" icon={<BarChart />} color="#8b5cf6" />
);

export const config = {
    id: 'complexityAnalysis',
    type: 'complexityAnalysis',
    label: 'Complexity',
    category: 'Quality',
    color: '#8b5cf6',
    icon: <BarChart size={16} />,

    generators: {
        github: () => ({ run: 'npx plato -r -d report src' }),
    },
};
