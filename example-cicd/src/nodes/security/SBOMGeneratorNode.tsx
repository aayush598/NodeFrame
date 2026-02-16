import React from 'react';
import { NodeProps } from 'reactflow';
import { FileJson } from 'lucide-react';
import { BaseNode, CustomNodeData } from 'workflow-canvas';

export const SBOMGeneratorNode: React.FC<NodeProps<CustomNodeData>> = (props) => (
    <BaseNode {...props} title="Generate SBOM" icon={<FileJson />} color="#ef4444" />
);

export const config = {
    id: 'sbomGenerator',
    type: 'sbomGenerator',
    label: 'SBOM',
    category: 'Security',
    color: '#ef4444',
    icon: <FileJson size={16} />,

    generators: {
        github: () => ({ run: 'cyclonedx-bom -o sbom.xml' }),
    },
};
