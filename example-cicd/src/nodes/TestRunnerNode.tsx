import React from 'react';
import { NodeProps } from 'reactflow';
import { FlaskConical } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

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
