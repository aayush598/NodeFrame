import React from 'react';
import { NodeProps } from 'reactflow';
import { Cloud } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const CloudFormationDeployNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
    return (
        <BaseNode
            {...props}
            title="CloudFormation Deploy"
            icon={<Cloud />}
            color="#f97316"
        />
    );
};

export const config = {
    id: 'cloudFormationDeploy',
    type: 'cloudFormationDeploy',
    label: 'CloudFormation Deploy',
    category: 'Infrastructure',
    color: '#f97316',
    icon: <Cloud size={16} />,

    defaultData: {
        description: 'Deploy AWS CloudFormation stack',
        properties: {
            stackName: '',
            templateFile: 'template.yml',
            region: 'us-east-1',
        },
    },

    propertyDefinitions: [
        { name: 'stackName', label: 'Stack Name', type: 'string' },
        { name: 'templateFile', label: 'Template File', type: 'string' },
        { name: 'region', label: 'Region', type: 'string' },
    ],

    generators: {
        github: (node: any) => ({
            name: 'Deploy CloudFormation',
            run: `aws cloudformation deploy --stack-name ${node.data.properties.stackName} --template-file ${node.data.properties.templateFile} --region ${node.data.properties.region}`,
        }),
        gitlab: (node: any) => ({
            script: [
                `aws cloudformation deploy --stack-name ${node.data.properties.stackName} --template-file ${node.data.properties.templateFile} --region ${node.data.properties.region}`,
            ],
        }),
        jenkins: (node: any) => [
            `sh 'aws cloudformation deploy --stack-name ${node.data.properties.stackName} --template-file ${node.data.properties.templateFile} --region ${node.data.properties.region}'`,
        ],
    },
};
