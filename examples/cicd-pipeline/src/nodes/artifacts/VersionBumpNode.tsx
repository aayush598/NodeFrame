import React from 'react';
import { NodeProps } from 'reactflow';
import { ArrowUp } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const VersionBumpNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const type = data.properties?.type || 'patch';

    return (
        <BaseNode {...props} title={data.label || "Version Bump"} icon={<ArrowUp />} color="#14b8a6">
            <div className="text-[10px] uppercase">{type}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'versionBump',
    type: 'versionBump',
    label: 'Version Bump',
    category: 'Artifacts',
    color: '#14b8a6',
    icon: <ArrowUp size={16} />,
    defaultData: {
        label: 'Version Bump',
        description: 'Bumps the version of the package',
        properties: {
            type: 'patch',
        },
    },

    propertyDefinitions: [
        {
            name: 'type',
            label: 'Bump Type',
            type: 'select',
            options: [
                { label: 'Patch', value: 'patch' },
                { label: 'Minor', value: 'minor' },
                { label: 'Major', value: 'major' },
            ],
        },
    ],

    generators: {
        github: (node: any) => ({
            run: `npm version ${node.data.properties.type}`,
        }),
    },
};
