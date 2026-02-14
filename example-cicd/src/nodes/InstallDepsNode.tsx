import React from 'react';
import { NodeProps } from 'reactflow';
import { Package } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

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
