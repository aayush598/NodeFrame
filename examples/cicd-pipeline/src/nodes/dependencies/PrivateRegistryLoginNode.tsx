import React from 'react';
import { NodeProps } from 'reactflow';
import { Lock } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PrivateRegistryLoginNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const registry = data.properties?.registry || 'npm';

    return (
        <BaseNode {...props} title={data.label || "Registry Login"} icon={<Lock />} color="#0ea5e9">
            <div className="text-[10px]">{registry}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'registryLogin',
    type: 'registryLogin',
    label: 'Registry Login',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Lock size={16} />,

    propertyDefinitions: [
        { name: 'registry', label: 'Registry', type: 'string' },
    ],

    generators: {
        github: () => ({
            run: 'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc',
        }),
    },
};
