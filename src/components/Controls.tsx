import React from 'react';
import { Controls as RFControls } from '@reactflow/controls';

interface ControlsProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Controls: React.FC<ControlsProps> = ({
  showZoom = true,
  showFitView = true,
  showInteractive = true,
  position = 'bottom-left'
}) => {
  return (
    <RFControls
      position={position}
      showZoom={showZoom}
      showFitView={showFitView}
      showInteractive={showInteractive}
      className="!bg-white !border !border-gray-200 !shadow-lg !rounded-lg"
    />
  );
};
