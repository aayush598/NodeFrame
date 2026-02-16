import React from 'react';
import { NodeProps } from 'reactflow';
import { PackagePlus } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CreateReleaseAssetNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title={data.label || "Release Asset"}
            icon={<PackagePlus />}
            color="#8b5cf6"
        />
    );
};

export const config = {
    id: 'createReleaseAsset',
    type: 'createReleaseAsset',
    label: 'Create Release Asset',
    category: 'Release',
    color: '#8b5cf6',
    icon: <PackagePlus size={16} />,

    defaultData: {
        description: 'Upload release assets',
        properties: {
            filePath: '',
        },
    },

    propertyDefinitions: [
        { name: 'filePath', label: 'File Path', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Upload Release Asset',
            run: `echo "Upload release asset"`,
        }),
        gitlab: () => ({
            script: [`echo "Upload release asset"`],
        }),
        jenkins: () => [`sh 'echo "Upload release asset"'`],
    },
};
