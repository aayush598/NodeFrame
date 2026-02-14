import React from 'react';
import { NodeProps } from 'reactflow';
import { Shield } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

export const SecurityScanNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const scanner = data.properties?.scanner || 'snyk';
    const severity = data.properties?.severity || 'high';
    const failOnIssues = data.properties?.failOnIssues !== false;

    const severityColors: Record<string, string> = {
        low: 'bg-blue-100 text-blue-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-orange-100 text-orange-700',
        critical: 'bg-red-100 text-red-700',
    };

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                {scanner}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${severityColors[severity] || severityColors.high}`}>
                {severity}+
            </span>
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Security Scan'}
            icon={data.icon || <Shield />}
            color={data.color || '#f59e0b'}
            headerRight={headerRight}
        >
            {failOnIssues && (
                <div>
                    <span className="text-[9px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-bold">
                        FAIL ON ISSUES
                    </span>
                </div>
            )}
        </BaseNode>
    );
};
