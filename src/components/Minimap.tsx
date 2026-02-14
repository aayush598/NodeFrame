import React from 'react';
import { MiniMap as RFMiniMap } from '@reactflow/minimap';

interface MinimapProps {
  nodeColor?: string | ((node: any) => string);
  nodeStrokeColor?: string | ((node: any) => string);
  nodeBorderRadius?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const Minimap: React.FC<MinimapProps> = ({
  nodeColor,
  nodeStrokeColor,
  nodeBorderRadius = 4,
  position = 'bottom-right',
  className = ''
}) => {
  const defaultNodeColor = (node: any) => {
    if (node.selected) return '#3b82f6';
    return node.data?.color || '#e5e7eb';
  };

  return (
    <RFMiniMap
      nodeColor={nodeColor || defaultNodeColor}
      nodeStrokeColor={nodeStrokeColor || '#9ca3af'}
      nodeBorderRadius={nodeBorderRadius}
      position={position}
      className={`!bg-white !border !border-gray-200 !shadow-lg !rounded-lg ${className}`}
      maskColor="rgba(0, 0, 0, 0.05)"
    />
  );
};
