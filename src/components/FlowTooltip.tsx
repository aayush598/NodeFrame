import { memo } from 'react';
import { createPortal } from 'react-dom';

interface FlowTooltipProps {
    label?: string;
    description?: string;
    platforms?: string[];
    x: number;
    y: number;
    visible: boolean;
}

export const FlowTooltip = memo(({ label, description, platforms, x, y, visible }: FlowTooltipProps) => {
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
            {platforms && platforms.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Supported Platforms</div>
                    <div className="flex flex-wrap gap-1">
                        {platforms.map(p => (
                            <span key={p} className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-bold uppercase text-gray-300">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
});
