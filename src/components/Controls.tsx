import React from 'react';
import { Controls as RFControls } from '@reactflow/controls';
import { ZoomIn, ZoomOut, Maximize, Lock } from 'lucide-react';

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
    >
      <div className="flex flex-col gap-1 p-1">
        {showZoom && (
          <>
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-gray-700" />
            </button>
          </>
        )}
        {showFitView && (
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Fit View"
          >
            <Maximize className="w-4 h-4 text-gray-700" />
          </button>
        )}
        {showInteractive && (
          <button
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Toggle Interactivity"
          >
            <Lock className="w-4 h-4 text-gray-700" />
          </button>
        )}
      </div>
    </RFControls>
  );
};
