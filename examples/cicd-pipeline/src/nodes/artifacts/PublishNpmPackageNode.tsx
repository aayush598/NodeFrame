import React from 'react';
import { NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PublishNpmPackageNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title={data.label || "Publish NPM"} icon={<Package />} color="#14b8a6" />
);

export const config = {
    id: 'publishNpm',
    type: 'publishNpm',
    label: 'Publish NPM',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <Package size={16} />,

    generators: {
        github: () => ({ run: 'npm publish --access public' }),
        gitlab: () => ({ script: ['npm publish --access public'] }),
        jenkins: () => ([`sh 'npm publish --access public'`]),
    },
};
