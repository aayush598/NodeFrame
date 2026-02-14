import React from 'react';
import { NodeProps } from 'reactflow';
import { Triangle } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const VercelDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return <BaseNode {...props} title="Vercel Deploy" icon={<Triangle />} color="#000000" />;
};

export const config = {
    id: 'vercelDeploy',
    type: 'vercelDeploy',
    label: 'Vercel Deploy',
    category: 'Deploy',
    color: '#000000',
    icon: <Triangle size={16} />,

    defaultData: {
        description: 'Deploy to Vercel',
        properties: {},
    },

    propertyDefinitions: [],

    generators: {
        github: () => ({
            name: 'Vercel Deploy',
            uses: 'amondnet/vercel-action@v25',
        }),
        gitlab: () => ({
            script: [`npx vercel --prod`],
        }),
        jenkins: () => [`sh 'npx vercel --prod'`],
    },
};
