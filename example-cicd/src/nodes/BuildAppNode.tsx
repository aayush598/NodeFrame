import React from 'react';
import { NodeProps } from 'reactflow';
import { Code } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

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
