import React from 'react';
import { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const BuildAppNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const buildTool = data.properties?.buildTool || 'vite';
    const outputDir = data.properties?.outputDir || 'dist';

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded uppercase">
                {buildTool}
            </span>
            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                {outputDir}
            </span>
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Build App'}
            icon={data.icon || <Code />}
            color={data.color || '#8b5cf6'}
            headerRight={headerRight}
        />
    );
};

export const config = {
    id: 'buildApp',
    type: 'buildApp',
    label: 'Build App',
    category: 'Build',
    color: '#8b5cf6',
    icon: <Code size={16} />,
    defaultData: {
        description: 'Compiles and builds the application code for production',
        properties: {
            buildTool: 'vite',
            outputDir: 'dist',
            buildCommand: 'npm run build',
        },
        onExecute: () => ({ built: true }),
    },
    propertyDefinitions: [
        {
            name: 'buildTool',
            label: 'Build Tool',
            type: 'select',
            options: [
                { label: 'Vite', value: 'vite' },
                { label: 'Webpack', value: 'webpack' },
                { label: 'Rollup', value: 'rollup' },
                { label: 'esbuild', value: 'esbuild' },
            ],
        },
        {
            name: 'outputDir',
            label: 'Output Directory',
            type: 'string',
            defaultValue: 'dist',
        },
        {
            name: 'buildCommand',
            label: 'Build Command',
            type: 'string',
            defaultValue: 'npm run build',
        },
    ],
    generators: {
        github: (node: any) => {
            return {
                name: node.data.label || 'Build application',
                run: node.data.properties?.buildCommand || `npm run build`,
            };
        },
        gitlab: (node: any) => {
            return {
                script: [node.data.properties?.buildCommand || 'npm run build']
            };
        },
        jenkins: (node: any) => {
            return [`sh '${node.data.properties?.buildCommand || 'npm run build'}'`];
        }
    }
};
