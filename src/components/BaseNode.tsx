import React from 'react';
import { Handle, NodeProps, Position } from '@reactflow/core';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { CustomNodeData } from '../types';

export interface BaseNodeProps extends NodeProps<CustomNodeData> {
    /**
     * Override title. Defaults to data.label.
     */
    title?: React.ReactNode;

    /**
     * Override icon. Defaults to data.icon.
     */
    icon?: React.ReactNode;

    /**
     * Main theme color for the node. Defaults to data.color or a default blue.
     */
    color?: string;

    /**
     * Custom content to render in the header right side (badges, tags).
     */
    headerRight?: React.ReactNode;

    /**
     * Custom content to render in the body of the node.
     */
    children?: React.ReactNode;

    /**
     * Custom content to render in the footer (buttons, actions).
     */
    footer?: React.ReactNode;

    /**
     * Styling overrides.
     */
    className?: string;
    style?: React.CSSProperties;

    // Handle Configuration
    isSource?: boolean;
    isTarget?: boolean;
    sourceHandleColor?: string; // Defaults to the node color
    targetHandleColor?: string; // Defaults to the node color
    handles?: React.ReactNode;
}

export const BaseNode: React.FC<BaseNodeProps> = ({
    // NodeProps
    data,
    selected,
    isConnectable,

    // Custom Props
    title,
    icon,
    color,
    headerRight,
    footer,
    children,
    className = '',
    style = {},

    // Handles
    isSource = true,
    isTarget = true,
    sourceHandleColor,
    targetHandleColor,
    handles
}) => {
    const status = data.executionStatus || 'idle';
    const nodeColor = color || data.color || '#3b82f6';
    const nodeTitle = title || data.label || 'Node';
    const NodeIcon = icon || data.icon;

    const resolvedSourceColor = sourceHandleColor || nodeColor;
    const resolvedTargetColor = targetHandleColor || nodeColor;

    return (
        <div
            className={`relative px-4 py-3 rounded-lg bg-white border-2 shadow-md min-w-[200px] transition-all group ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                } ${status === 'executing' ? 'node-executing' :
                    status === 'success' ? 'node-success' :
                        status === 'error' ? 'node-error' : ''
                } ${className}`}
            style={{
                borderColor: status === 'idle' ? nodeColor : undefined,
                ...style
            }}
        >
            {/* Status Badge */}
            <div className={`status-badge ${status !== 'idle' ? 'visible' : ''} ${status === 'success' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                }`}>
                {status === 'executing' && <Loader2 className="w-3 h-3 text-white animate-spin" />}
                {status === 'success' && <CheckCircle className="w-3 h-3 text-white" />}
                {status === 'error' && <AlertCircle className="w-3 h-3 text-white" />}
            </div>

            {/* Target Handle */}
            {isTarget && (
                <Handle
                    type="target"
                    position={Position.Left}
                    isConnectable={isConnectable}
                    className="w-3 h-3 !border-2 !border-white transition-colors"
                    style={{ backgroundColor: resolvedTargetColor }}
                />
            )}

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0"
                    style={{ backgroundColor: nodeColor }}
                >
                    {NodeIcon ? (
                        /* If it's a React Element, clone it with props/class if needed, 
                           but usually icon prop is already an element. 
                           If it's a raw component, we might need other logic, 
                           but standard Lucid icons are passed as elements usually. 
                         */
                        <span className="text-white flex items-center justify-center">
                            {/* We assume the icon is passed as an element <Icon size={...} /> */}
                            {React.isValidElement(NodeIcon) ?
                                React.cloneElement(NodeIcon as React.ReactElement<any>, {
                                    size: 16,
                                    className: 'text-white'
                                })
                                : NodeIcon
                            }
                        </span>
                    ) : (
                        <div className="w-4 h-4 bg-white/20 rounded-full" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate" title={typeof nodeTitle === 'string' ? nodeTitle : undefined}>
                        {nodeTitle}
                    </div>
                    {/* Header Right / Subtitle Area if needed */}
                    {headerRight && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                            {headerRight}
                        </div>
                    )}
                </div>
            </div>

            {/* Body Content */}
            {children && (
                <div className="mt-2">
                    {children}
                </div>
            )}

            {/* Footer */}
            {footer && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                    {footer}
                </div>
            )}

            {/* Source Handle */}
            {isSource && (
                <Handle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                    className="w-3 h-3 !border-2 !border-white transition-colors"
                    style={{ backgroundColor: resolvedSourceColor }}
                />
            )}

            {/* Custom Handles */}
            {handles}
        </div>
    );
};
