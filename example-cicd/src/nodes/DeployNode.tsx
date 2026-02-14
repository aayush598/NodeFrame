import React from 'react';
import { NodeProps } from 'reactflow';
import { Rocket } from 'lucide-react';
import { CustomNodeData, BaseNode } from '@nodeframe';

export const DeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const platform = data.properties?.platform || 'aws';
    const environment = data.properties?.environment || 'staging';
    const region = data.properties?.region || 'us-east-1';

    const platformColors: Record<string, string> = {
        aws: 'bg-orange-100 text-orange-700',
        vercel: 'bg-black text-white',
        kubernetes: 'bg-blue-100 text-blue-700',
        ssh: 'bg-gray-100 text-gray-700',
    };

    const envColors: Record<string, string> = {
        staging: 'bg-yellow-100 text-yellow-700',
        production: 'bg-red-100 text-red-700',
        development: 'bg-green-100 text-green-700',
    };

    const headerRight = (
        <>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${platformColors[platform] || platformColors.aws}`}>
                {platform}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${envColors[environment] || envColors.staging}`}>
                {environment}
            </span>
        </>
    );

    return (
        <BaseNode
            {...props}
            title={data.label || 'Deploy'}
            icon={data.icon || <Rocket />}
            color={data.color || '#ec4899'}
            headerRight={headerRight}
        >
            {region && (
                <div className="mt-2">
                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-mono">
                        {region}
                    </span>
                </div>
            )}
        </BaseNode>
    );
};
