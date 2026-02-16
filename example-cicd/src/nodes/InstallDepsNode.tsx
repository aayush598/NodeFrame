import React from 'react';
import { NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const InstallDepsNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const packageManager = data.properties?.packageManager || 'npm';
    const cacheEnabled = data.properties?.cacheEnabled !== false;

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded uppercase">
                {packageManager}
            </span>
            {cacheEnabled && (
                <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    cached
                </span>
            )}
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Install Dependencies'}
            icon={data.icon || <Package />}
            color={data.color || '#3b82f6'}
            headerRight={headerRight}
        />
    );
};

export const config = {
    id: 'installDeps',
    type: 'installDeps',
    label: 'Install Dependencies',
    category: 'Build',
    color: '#3b82f6',
    icon: <Package size={16} />,
    defaultData: {
        description: 'Installs project dependencies using the specified package manager',
        properties: {
            packageManager: 'npm',
            cacheEnabled: true,
            installCommand: '',
        },
        onExecute: () => ({ installed: true }),
    },
    propertyDefinitions: [
        {
            name: 'packageManager',
            label: 'Package Manager',
            type: 'select',
            options: [
                { label: 'npm', value: 'npm' },
                { label: 'yarn', value: 'yarn' },
                { label: 'pnpm', value: 'pnpm' },
                { label: 'bun', value: 'bun' },
            ],
        },
        {
            name: 'cacheEnabled',
            label: 'Enable Cache',
            type: 'boolean',
            defaultValue: true,
        },
        {
            name: 'installCommand',
            label: 'Custom Install Command',
            type: 'string',
        },
    ],
    generators: {
        github: (node: any) => {
            const pkgMgr = node.data.properties?.packageManager || 'npm';
            const cacheEnabled = node.data.properties?.cacheEnabled !== false;
            const steps = [];

            if (cacheEnabled) {
                steps.push({
                    name: 'Cache dependencies',
                    uses: 'actions/cache@v3',
                    with: {
                        path: pkgMgr === 'npm' ? '~/.npm' : '~/.cache',
                        key: `\${{ runner.os }}-${pkgMgr}-\${{ hashFiles('**/package-lock.json') }}`,
                    }
                });
            }

            steps.push({
                name: node.data.label || 'Install dependencies',
                run: node.data.properties?.installCommand || `${pkgMgr} install`,
            });

            return steps;
        },
        gitlab: (node: any) => {
            const pkgMgr = node.data.properties?.packageManager || 'npm';
            const cacheEnabled = node.data.properties?.cacheEnabled !== false;
            return {
                script: [node.data.properties?.installCommand || `${pkgMgr} install`],
                cache: cacheEnabled ? { paths: [pkgMgr === 'npm' ? 'node_modules/' : '.cache/'] } : undefined
            };
        },
        jenkins: (node: any) => {
            const pkgMgr = node.data.properties?.packageManager || 'npm';
            return [`sh '${node.data.properties?.installCommand || `${pkgMgr} install`}'`];
        }
    }
};
