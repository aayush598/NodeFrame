import React from 'react';
import { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DependencyCacheRestoreNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Restore Cache" icon={<Database />} color="#0ea5e9" />
);

export const config = {
    id: 'cacheRestore',
    type: 'cacheRestore',
    label: 'Cache Restore',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Database size={16} />,
};
