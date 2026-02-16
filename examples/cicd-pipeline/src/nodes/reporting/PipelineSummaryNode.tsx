import React from 'react';
import { NodeProps } from 'reactflow';
import { LayoutDashboard } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const PipelineSummaryNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="Pipeline Summary"
            icon={<LayoutDashboard />}
            color="#6366f1"
        />
    );
};

export const config = {
    id: 'pipelineSummary',
    type: 'pipelineSummary',
    label: 'Pipeline Summary',
    category: 'Reporting',
    color: '#6366f1',
    icon: <LayoutDashboard size={16} />,

    defaultData: {
        description: 'Generate pipeline execution summary',
        properties: {},
    },

    propertyDefinitions: [],

    generators: {
        github: () => ({
            name: 'Pipeline Summary',
            run: `echo "Generate pipeline summary"`,
        }),
        gitlab: () => ({
            script: [`echo "Generate pipeline summary"`],
        }),
        jenkins: () => [`sh 'echo "Generate pipeline summary"'`],
    },
};
