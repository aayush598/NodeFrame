import React from 'react';
import { NodeProps } from 'reactflow';
import { Gauge } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const LintNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const linter = data.properties?.linter || 'eslint';
    const autoFix = data.properties?.autoFix === true;

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded uppercase">
                {linter}
            </span>
            {autoFix && (
                <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold">
                    AUTO-FIX
                </span>
            )}
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Lint Code'}
            icon={data.icon || <Gauge />}
            color={data.color || '#14b8a6'}
            headerRight={headerRight}
        />
    );
};

export const config = {
    id: 'lint',
    type: 'lint',
    label: 'Lint Code',
    category: 'Quality',
    color: '#14b8a6',
    icon: <Gauge size={16} />,
    defaultData: {
        description: 'Analyzes code for styling and syntax errors using a linter',
        properties: {
            linter: 'eslint',
            autoFix: false,
        },
        onExecute: () => ({ linted: true }),
    },
    propertyDefinitions: [
        {
            name: 'linter',
            label: 'Linter',
            type: 'select',
            options: [
                { label: 'ESLint', value: 'eslint' },
                { label: 'Prettier', value: 'prettier' },
                { label: 'Biome', value: 'biome' },
            ],
        },
        {
            name: 'autoFix',
            label: 'Auto-fix Issues',
            type: 'boolean',
            defaultValue: false,
        },
    ],
    generators: {
        github: (node: any) => {
            const linter = node.data.properties?.linter || 'eslint';
            const autoFix = node.data.properties?.autoFix === true;

            return {
                name: node.data.label || 'Lint code',
                run: autoFix ? `${linter} --fix .` : `${linter} .`,
            };
        },
        gitlab: (node: any) => {
            const linter = node.data.properties?.linter || 'eslint';
            const autoFix = node.data.properties?.autoFix === true;
            return {
                script: [autoFix ? `${linter} --fix .` : `${linter} .`]
            };
        },
        jenkins: (node: any) => {
            const linter = node.data.properties?.linter || 'eslint';
            const autoFix = node.data.properties?.autoFix === true;
            return [`sh '${autoFix ? `${linter} --fix .` : `${linter} .`}'`];
        }
    }
};
