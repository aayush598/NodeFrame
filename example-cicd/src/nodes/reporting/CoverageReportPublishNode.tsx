import React from 'react';
import { NodeProps } from 'reactflow';
import { PieChart } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CoverageReportPublishNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const tool = props.data.properties?.tool || 'lcov';

    return (
        <BaseNode
            {...props}
            title="Coverage Report"
            icon={<PieChart />}
            color="#0ea5e9"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {tool}
                </span>
            }
        />
    );
};

export const config = {
    id: 'coverageReportPublish',
    type: 'coverageReportPublish',
    label: 'Coverage Report Publish',
    category: 'Reporting',
    color: '#0ea5e9',
    icon: <PieChart size={16} />,

    defaultData: {
        description: 'Publish code coverage reports',
        properties: {
            tool: 'lcov',
            path: './coverage',
        },
    },

    propertyDefinitions: [
        { name: 'tool', label: 'Coverage Tool', type: 'string' },
        { name: 'path', label: 'Coverage Path', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Publish Coverage',
            run: `echo "Publish coverage report"`,
        }),
        gitlab: () => ({
            script: [`echo "Publish coverage report"`],
        }),
        jenkins: () => [`sh 'echo "Publish coverage report"'`],
    },
};
