import React from 'react';
import { NodeProps } from 'reactflow';
import { Gauge } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

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
