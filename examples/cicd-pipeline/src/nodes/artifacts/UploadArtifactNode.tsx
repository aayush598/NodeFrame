import React from 'react';
import { NodeProps } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const UploadArtifactNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const name = data.properties?.name || 'artifact';

    return (
        <BaseNode {...props} title="Upload Artifact" icon={<Upload />} color="#14b8a6">
            <div className="text-[10px]">{name}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'uploadArtifact',
    type: 'uploadArtifact',
    label: 'Upload Artifact',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <Upload size={16} />,
    defaultData: {
        label: 'Upload Artifact',
        description: 'Uploads an artifact from the workflow run',
        properties: {
            name: 'artifact',
            path: 'dist',
        },
    },

    propertyDefinitions: [
        { name: 'name', label: 'Artifact Name', type: 'string' },
        { name: 'path', label: 'Path', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/upload-artifact@v4',
            with: {
                name: node.data.properties.name,
                path: node.data.properties.path,
            },
        }),

        gitlab: (node: any) => ({
            artifacts: { paths: [node.data.properties.path] },
        }),

        jenkins: () => ([`archiveArtifacts artifacts: '**/*'`]),
    },
};
