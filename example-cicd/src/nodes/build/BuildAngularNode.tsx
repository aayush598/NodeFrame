import React from 'react';
import { NodeProps } from 'reactflow';
import { Triangle } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const BuildAngularNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Build Angular" icon={<Triangle />} color="#f59e0b" />
);

export const config = {
    id: 'buildAngular',
    type: 'buildAngular',
    label: 'Angular',
    category: 'Build',
    color: '#f59e0b',
    icon: <Triangle size={16} />,

    generators: {
        github: () => ({ run: 'npm run build -- --prod' }),
    },
};
