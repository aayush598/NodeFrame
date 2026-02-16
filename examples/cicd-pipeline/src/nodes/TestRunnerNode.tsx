import React from 'react';
import { NodeProps } from 'reactflow';
import { FlaskConical } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const TestRunnerNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const testType = data.properties?.testType || 'unit';
    const framework = data.properties?.framework || 'jest';
    const coverageEnabled = data.properties?.coverageEnabled === true;

    const typeColors: Record<string, string> = {
        unit: 'bg-purple-100 text-purple-700',
        integration: 'bg-orange-100 text-orange-700',
        e2e: 'bg-pink-100 text-pink-700',
    };

    const headerRight = (
        <>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${typeColors[testType] || typeColors.unit}`}>
                {testType}
            </span>
            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {framework}
            </span>
            {coverageEnabled && (
                <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    cov
                </span>
            )}
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Run Tests'}
            icon={data.icon || <FlaskConical />}
            color={data.color || '#a855f7'}
            headerRight={headerRight}
        />
    );
};

export const config = {
    id: 'testRunner',
    type: 'testRunner',
    label: 'Run Tests',
    category: 'Test',
    color: '#a855f7',
    icon: <FlaskConical size={16} />,
    defaultData: {
        description: 'Runs automated tests (unit, integration, e2e) using a specified framework',
        properties: {
            testType: 'unit',
            framework: 'jest',
            command: 'npm test',
            coverageEnabled: false,
        },
        onExecute: () => ({ passed: true }),
    },
    propertyDefinitions: [
        {
            name: 'testType',
            label: 'Test Type',
            type: 'select',
            options: [
                { label: 'Unit Tests', value: 'unit' },
                { label: 'Integration Tests', value: 'integration' },
                { label: 'E2E Tests', value: 'e2e' },
            ],
        },
        {
            name: 'framework',
            label: 'Test Framework',
            type: 'select',
            options: [
                { label: 'Jest', value: 'jest' },
                { label: 'Vitest', value: 'vitest' },
                { label: 'Playwright', value: 'playwright' },
                { label: 'Cypress', value: 'cypress' },
            ],
        },
        {
            name: 'command',
            label: 'Test Command',
            type: 'string',
            defaultValue: 'npm test',
        },
        {
            name: 'coverageEnabled',
            label: 'Enable Coverage',
            type: 'boolean',
            defaultValue: false,
        },
    ],
    generators: {
        github: (node: any) => {
            const testCmd = node.data.properties?.command || 'npm test';
            const coverage = node.data.properties?.coverageEnabled === true;

            return {
                name: node.data.label || 'Run tests',
                run: coverage ? `${testCmd} --coverage` : testCmd,
            };
        },
        gitlab: (node: any) => {
            const testCmd = node.data.properties?.command || 'npm test';
            const coverage = node.data.properties?.coverageEnabled === true;
            return {
                script: [coverage ? `${testCmd} --coverage` : testCmd]
            };
        },
        jenkins: (node: any) => {
            const testCmd = node.data.properties?.command || 'npm test';
            const coverage = node.data.properties?.coverageEnabled === true;
            return [`sh '${coverage ? `${testCmd} --coverage` : testCmd}'`];
        }
    }
};
