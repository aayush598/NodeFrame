import React from 'react';
import { NodeProps } from 'reactflow';
import { Download } from 'lucide-react';
import { BaseNode, CustomNodeData } from '@nodeframe';

export const CheckoutRepoNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { data } = props;
  const repo = data.properties?.repo || 'self';
  const ref = data.properties?.ref || 'main';

  return (
    <BaseNode {...props} title="Checkout Repo" icon={<Download />} color="#3b82f6">
      <div className="text-[10px]">Repo: {repo}</div>
      <div className="text-[10px]">Ref: {ref}</div>
    </BaseNode>
  );
};

export const config = {
  id: 'checkoutRepo',
  type: 'checkoutRepo',
  label: 'Checkout Repo',
  category: 'Source',
  color: '#3b82f6',
  icon: <Download size={16} />,

  defaultData: {
    properties: {
      repo: 'self',
      ref: 'main',
      depth: 1,
    },
  },

  propertyDefinitions: [
    { name: 'repo', label: 'Repository', type: 'string' },
    { name: 'ref', label: 'Branch/Tag', type: 'string' },
    { name: 'depth', label: 'Clone Depth', type: 'number' },
  ],

  generators: {
    github: () => ({
      uses: 'actions/checkout@v4',
    }),

    gitlab: () => ({
      script: ['git clone $CI_REPOSITORY_URL'],
    }),

    jenkins: () => ([
      `checkout scm`
    ]),
  },
};
