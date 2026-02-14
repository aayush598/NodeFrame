import React from 'react';
import { NodeProps } from 'reactflow';
import { PieChart } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const CoverageReportNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Coverage Report" icon={<PieChart />} color="#10b981" />
);

export const config = {
    id: 'coverageReport',
    type: 'coverageReport',
    label: 'Coverage Report',
    category: 'Test',
    color: '#10b981',
    icon: <PieChart size={16} />,
};
