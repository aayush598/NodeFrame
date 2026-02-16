import React from 'react';
import { NodeProps } from 'reactflow';
import { FlaskConical } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const TestRunnerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const framework = data.properties?.framework || 'jest';

    return (
        <BaseNode {...props} title="Run Tests" icon={<FlaskConical />} color="#10b981">
            <div className="text-[10px] uppercase">{framework}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'testRunner',
    type: 'testRunner',
    label: 'Run Tests',
    category: 'Test',
    color: '#10b981',
    icon: <FlaskConical size={16} />,

    propertyDefinitions: [
        {
            name: 'framework',
            label: 'Framework',
            type: 'select',
            options: [
                { label: 'Jest', value: 'jest' },
                { label: 'Vitest', value: 'vitest' },
                { label: 'Mocha', value: 'mocha' },
            ],
        },
    ],

    generators: {
        github: () => ({ run: 'npm test' }),
        gitlab: () => ({ script: ['npm test'] }),
        jenkins: () => ([`sh 'npm test'`]),
    },
};
