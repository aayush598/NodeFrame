import React from 'react';
import { NodeProps } from 'reactflow';
import { Download } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const DownloadArtifactNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const name = data.properties?.name || 'artifact';

    return (
        <BaseNode {...props} title={data.label || "Download Artifact"} icon={<Download />} color="#14b8a6">
            <div className="text-[10px]">{name}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'downloadArtifact',
    type: 'downloadArtifact',
    label: 'Download Artifact',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <Download size={16} />,
    defaultData: {
        label: 'Download Artifact',
        description: 'Downloads an artifact from the workflow run',
        properties: {
            name: 'artifact',
        },
    },

    propertyDefinitions: [
        { name: 'name', label: 'Artifact Name', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/download-artifact@v4',
            with: { name: node.data.properties.name },
        }),
    },
};
