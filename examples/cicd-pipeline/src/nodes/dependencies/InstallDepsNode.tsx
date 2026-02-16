import React from 'react';
import { NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const InstallDepsNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const manager = data.properties?.manager || 'npm';

    return (
        <BaseNode {...props} title="Install Deps" icon={<Package />} color="#0ea5e9">
            <div className="text-[10px] uppercase">{manager}</div>
        </BaseNode>
    );
};

export const config = {
    id: 'installDeps',
    type: 'installDeps',
    label: 'Install Dependencies',
    category: 'Dependencies',
    color: '#0ea5e9',
    icon: <Package size={16} />,

    defaultData: {
        properties: { manager: 'npm', frozenLockfile: false },
    },

    propertyDefinitions: [
        {
            name: 'manager',
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
            name: 'frozenLockfile',
            label: 'Frozen Lockfile',
            type: 'boolean',
        },
    ],

    generators: {
        github: (node: any) => ({
            run: `${node.data.properties.manager} install`,
        }),

        gitlab: (node: any) => ({
            script: [`${node.data.properties.manager} install`],
        }),

        jenkins: (node: any) => ([
            `sh '${node.data.properties.manager} install'`,
        ]),
    },
};
