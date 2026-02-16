import React from 'react';
import { NodeProps } from 'reactflow';
import { Tag } from 'lucide-react';
import { CustomNodeData, BaseNode } from 'workflow-canvas';

export const DockerTagNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  const { data } = props;
  const source = data.properties?.sourceTag || 'latest';
  const target = data.properties?.targetTag || 'v1.0.0';

  const headerRight = (
    <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">
      {source} → {target}
    </span>
  );

  return (
    <BaseNode
      {...props}
      title={data.label || 'Docker Tag'}
      icon={<Tag />}
      color="#0ea5e9"
      headerRight={headerRight}
    />
  );
};

export const config = {
  id: 'dockerTag',
  type: 'dockerTag',
  label: 'Docker Tag',
  category: 'Containers',
  color: '#0ea5e9',
  icon: <Tag size={16} />,

  defaultData: {
    description: 'Tags a Docker image',
    properties: {
      image: '',
      sourceTag: 'latest',
      targetTag: '',
    },
  },

  propertyDefinitions: [
    { name: 'image', label: 'Image', type: 'string' },
    { name: 'sourceTag', label: 'Source Tag', type: 'string' },
    { name: 'targetTag', label: 'Target Tag', type: 'string' },
  ],

  generators: {
    github: (node: any) => ({
      name: 'Docker Tag',
      run: `docker tag ${node.data.properties.image}:${node.data.properties.sourceTag} ${node.data.properties.image}:${node.data.properties.targetTag}`,
    }),
    gitlab: (node: any) => ({
      script: [
        `docker tag ${node.data.properties.image}:${node.data.properties.sourceTag} ${node.data.properties.image}:${node.data.properties.targetTag}`,
      ],
    }),
    jenkins: (node: any) => [
      `sh 'docker tag ${node.data.properties.image}:${node.data.properties.sourceTag} ${node.data.properties.image}:${node.data.properties.targetTag}'`,
    ],
  },
};
