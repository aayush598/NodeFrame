import React from 'react';
import { NodeProps } from 'reactflow';
import { Save } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DependencyCacheSaveNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Save Cache" icon={<Save />} color="#0ea5e9" />
);

export const config = {
    id: 'cacheSave',
    type: 'cacheSave',
    label: 'Cache Save',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Save size={16} />,
};
