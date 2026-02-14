import React from 'react';
import { NodeProps } from 'reactflow';
import { FileBarChart } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const TestReportNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const format = props.data.properties?.format || 'junit';

    return (
        <BaseNode
            {...props}
            title="Test Report"
            icon={<FileBarChart />}
            color="#22c55e"
            headerRight={
                <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">
                    {format}
                </span>
            }
        />
    );
};

export const config = {
    id: 'testReport',
    type: 'testReport',
    label: 'Test Report',
    category: 'Reporting',
    color: '#22c55e',
    icon: <FileBarChart size={16} />,

    defaultData: {
        description: 'Generate test execution reports',
        properties: {
            format: 'junit',
            reportPath: './reports',
        },
    },

    propertyDefinitions: [
        {
            name: 'format',
            label: 'Format',
            type: 'select',
            options: [
                { label: 'JUnit', value: 'junit' },
                { label: 'HTML', value: 'html' },
                { label: 'JSON', value: 'json' },
            ],
        },
        { name: 'reportPath', label: 'Report Path', type: 'string' },
    ],

    generators: {
        github: () => ({
            name: 'Publish Test Report',
            run: `echo "Publishing test reports"`,
        }),
        gitlab: () => ({
            script: [`echo "Publishing test reports"`],
        }),
        jenkins: () => [`sh 'echo "Publishing test reports"'`],
    },
};
