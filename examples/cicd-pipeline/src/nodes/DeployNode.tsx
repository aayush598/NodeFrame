import React from 'react';
import { NodeProps } from 'reactflow';
import { Rocket } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const DeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    const { data } = props;
    const platform = data.properties?.platform || 'aws';
    const environment = data.properties?.environment || 'staging';
    const region = data.properties?.region || 'us-east-1';

    const envColors: Record<string, string> = {
        staging: 'bg-yellow-100 text-yellow-700',
        production: 'bg-red-100 text-red-700',
        development: 'bg-green-100 text-green-700',
    };

    const headerRight = (
        <>
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
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

export const config = {
    id: 'deploy',
    type: 'deploy',
    label: 'Deploy',
    category: 'Deploy',
    color: '#ec4899',
    icon: <Rocket size={16} />,
    defaultData: {
        description: 'Deploys the application to a target platform or environment',
        properties: {
            platform: 'aws',
            environment: 'staging',
            region: 'us-east-1',
            healthCheck: '',
        },
        onExecute: () => ({ deployed: true }),
    },
    propertyDefinitions: [
        {
            name: 'platform',
            label: 'Platform',
            type: 'select',
            options: [
                { label: 'AWS', value: 'aws' },
                { label: 'Vercel', value: 'vercel' },
                { label: 'Kubernetes', value: 'kubernetes' },
                { label: 'SSH', value: 'ssh' },
            ],
        },
        {
            name: 'environment',
            label: 'Environment',
            type: 'select',
            options: [
                { label: 'Development', value: 'development' },
                { label: 'Staging', value: 'staging' },
                { label: 'Production', value: 'production' },
            ],
        },
        {
            name: 'region',
            label: 'Region',
            type: 'string',
            defaultValue: 'us-east-1',
        },
        {
            name: 'healthCheck',
            label: 'Health Check URL',
            type: 'string',
        },
    ],
    generators: {
        github: (node: any) => {
            const platform = node.data.properties?.platform || 'aws';
            const environment = node.data.properties?.environment || 'staging';

            if (platform === 'vercel') {
                return {
                    name: node.data.label || 'Deploy to Vercel',
                    uses: 'amondnet/vercel-action@v25',
                    with: {
                        'vercel-token': '${{ secrets.VERCEL_TOKEN }}',
                        'vercel-org-id': '${{ secrets.VERCEL_ORG_ID }}',
                        'vercel-project-id': '${{ secrets.VERCEL_PROJECT_ID }}',
                    }
                };
            } else {
                return {
                    name: node.data.label || `Deploy to ${platform}`,
                    run: `echo "Deploying to ${platform} (${environment})"`,
                };
            }
        },
        gitlab: (node: any) => {
            const platform = node.data.properties?.platform || 'aws';
            const environment = node.data.properties?.environment || 'staging';
            return {
                script: [`echo "Deploying to ${platform} (${environment})"`]
            };
        },
        jenkins: (node: any) => {
            const platform = node.data.properties?.platform || 'aws';
            const environment = node.data.properties?.environment || 'staging';
            return [`sh 'echo "Deploying to ${platform} (${environment})"'`];
        }
    }
};
