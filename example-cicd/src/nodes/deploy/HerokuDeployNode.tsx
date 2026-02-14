import React from 'react';
import { NodeProps } from 'reactflow';
import { Cloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const HerokuDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return <BaseNode {...props} title="Heroku Deploy" icon={<Cloud />} color="#430098" />;
};

export const config = {
    id: 'herokuDeploy',
    type: 'herokuDeploy',
    label: 'Heroku Deploy',
    category: 'Deploy',
    color: '#430098',
    icon: <Cloud size={16} />,

    defaultData: {
        description: 'Deploy to Heroku',
        properties: { appName: '' },
    },

    propertyDefinitions: [
        { name: 'appName', label: 'App Name', type: 'string' },
    ],

    generators: {
        github: (n: any) => ({
            name: 'Heroku Deploy',
            run: `git push heroku main --app ${n.data.properties.appName}`,
        }),
        gitlab: (n: any) => ({
            script: [`git push heroku main --app ${n.data.properties.appName}`],
        }),
        jenkins: (n: any) => [
            `sh 'git push heroku main --app ${n.data.properties.appName}'`,
        ],
    },
};
