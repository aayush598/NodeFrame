import React from 'react';
import { NodeProps } from 'reactflow';
import { Archive } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PackageArtifactNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const format = data.properties?.format || 'zip';

    return (
        <BaseNode {...props} title={data.label || "Package Artifact"} icon={<Archive />} color="#f59e0b">
            <div className="text-[10px] uppercase">{format}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'packageArtifact',
    type: 'packageArtifact',
    label: 'Package Artifact',
    category: 'Build',
    color: '#f59e0b',
    icon: <Archive size={16} />,

    propertyDefinitions: [
        {
            name: 'format',
            label: 'Format',
            type: 'select',
            options: [
                { label: 'ZIP', value: 'zip' },
                { label: 'TAR', value: 'tar' },
            ],
        },
    ],

    generators: {
        github: () => ({ run: 'zip -r artifact.zip .' }),
    },
};
