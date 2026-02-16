import React from 'react';
import { NodeProps } from 'reactflow';
import { ShieldCheck } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const ImageSigningNode: React.FC<NodeProps<CustomNodeData>> = (props) => {

    return (
        <BaseNode
            {...props}
            title={data.label || "Image Signing"}
            icon={<ShieldCheck />}
            color="#ef4444"
            headerRight={
                <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                    cosign
                </span>
            }
        />
    );
};

export const config = {
    id: 'imageSigning',
    type: 'imageSigning',
    label: 'Image Signing',
    category: 'Containers',
    color: '#ef4444',
    icon: <ShieldCheck size={16} />,

    defaultData: {
        description: 'Sign container images using Cosign',
        properties: {
            image: '',
            keyRef: 'cosign.key',
        },
    },

    propertyDefinitions: [
        { name: 'image', label: 'Image', type: 'string' },
        { name: 'keyRef', label: 'Key Reference', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Sign Image',
            run: `cosign sign ${node.data.properties.image} --key ${node.data.properties.keyRef}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `cosign sign ${node.data.properties.image} --key ${node.data.properties.keyRef}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'cosign sign ${node.data.properties.image} --key ${node.data.properties.keyRef}'`,
        ],
    },
};
