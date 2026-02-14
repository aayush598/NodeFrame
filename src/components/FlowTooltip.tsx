import { memo } from 'react';
import { createPortal } from 'react-dom';

interface FlowTooltipProps {
    label?: string;
    description?: string;
    x: number;
    y: number;
    visible: boolean;
}

export const FlowTooltip = memo(({ label, description, x, y, visible }: FlowTooltipProps) => {
    // Only render if we have content and visibility
    if (!visible || (!label && !description)) return null;

    return createPortal(
        <div
            className="node-tooltip"
            style={{
                left: x + 15, // slight offset from cursor/node
                top: y + 15,
            }}
        >
            {label && <span className="node-tooltip-label">{label}</span>}
            {description && <div className="node-tooltip-description">{description}</div>}
        </div>,
        document.body
    );
});
