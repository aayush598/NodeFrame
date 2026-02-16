import React from 'react';
import { NodeProps } from 'reactflow';
import { Coffee } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SetupJavaNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const version = data.properties?.version || '17';

    return (
        <BaseNode {...props} title="Setup Java" icon={<Coffee />} color="#6366f1">
            <div className="text-[10px]">JDK {version}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'setupJava',
    type: 'setupJava',
    label: 'Java',
    category: 'Setup',
    color: '#6366f1',
    icon: <Coffee size={16} />,

    propertyDefinitions: [
        { name: 'version', label: 'JDK Version', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            uses: 'actions/setup-java@v4',
            with: { 'java-version': node.data.properties.version },
        }),
    },
};
