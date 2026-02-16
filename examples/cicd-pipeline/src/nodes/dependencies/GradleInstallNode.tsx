import React from 'react';
import { NodeProps } from 'reactflow';
import { Layers } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const GradleInstallNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
  <BaseNode {...props} title={data.label || "Gradle Build"} icon={<Layers />} color="#0ea5e9" />
);

export const config = {
  id: 'gradleInstall',
  type: 'gradleInstall',
  label: 'Gradle Install',
  category: 'Dependencies',
  color: '#0ea5e9',
  icon: <Layers size={16} />,

  generators: {
    github: () => ({ run: './gradlew build' }),
    gitlab: () => ({ script: ['./gradlew build'] }),
    jenkins: () => ([`sh './gradlew build'`]),
  },
};
