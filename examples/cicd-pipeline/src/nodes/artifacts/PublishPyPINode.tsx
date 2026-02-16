import React from 'react';
import { NodeProps } from 'reactflow';
import { UploadCloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PublishPyPINode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Publish PyPI" icon={<UploadCloud />} color="#14b8a6" />
);

export const config = {
    id: 'publishPyPI',
    type: 'publishPyPI',
    label: 'Publish PyPI',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <UploadCloud size={16} />,

    generators: {
        github: () => ({ run: 'twine upload dist/*' }),
    },
};
